import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import aws from 'aws-sdk';
import { PubSub, withFilter } from 'graphql-subscriptions';
import logger from '../../helpers/logger';

const pubsub = new PubSub();

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'eu-central-1',
});

dotenv.config();
const { JWT_SECRET } = process.env;

const { Op } = Sequelize;

export default function resolver() {
  const { db } = this;
  const {
    Post, User, Chat, Message,
  } = db.models;

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      chat(message, args, context) {
        return message.getChat();
      },
      user(message, args, context) {
        return message.getUser();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat.getMessages(
          { limit: 1, order: [['id', 'DESC']] },
        ).then(message => message[0]);
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'DESC']] });
      },
      chats(root, args, context) {
        return Chat.findAll({
          include: [{
            model: User,
            required: true,
            through: { where: { userId: context.user.id } },
          },
          { model: Message }],
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [{
            model: User,
            required: true,
          },
          {
            model: Message,
          }],
        });
      },
      postsFeed(root, { page, limit, username }, context) {
        let skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        if (typeof username !== typeof undefined) {
          query.include = [{ model: User }];
          query.where = { '$User.username$': username };
        }

        return {
          posts: Post.findAll(query),
        };
      },
      usersSearch(root, { page, limit, text }, context) {
        if (text.length < 3) {
          return {
            users: [],
          };
        }
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: `%${text}%`,
          },
        };
        return {
          users: User.findAll(query),
        };
      },
      currentUser(root, args, context) {
        return context.user;
      },
      user(root, { username }, context) {
        return User.findOne({
          where: {
            username,
          },
        });
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({
          level: 'info',
          message: 'Post was created',
        });

        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Post.create({
            ...post,
          }).then(newPost => Promise.all([
            newPost.setUser(usersRow.id),
          ]).then(() => newPost));
        });
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });
        return Chat.create().then(newChat => Promise.all([
          newChat.setUsers(chat.users),
        ]).then(() => newChat));
      },
      addMessage(root, { message }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });
        return Message.create({
          ...message,
        }).then(newMessage => Promise.all([
          newMessage.setUser(context.user.id),
          newMessage.setChat(message.chatId),
        ]).then(() => {
          pubsub.publish('messageAdded',
            { messageAdded: newMessage });
          return newMessage;
        }));
      },
      updatePost(root, { post, postId }, context) {
        return Post.update({ ...post },
          {
            where: { id: postId },
          }).then((rows) => {
          if (rows[0] === 1) {
            logger.log({
              level: 'info',
              message: `Post ${postId} was updated`,
            });

            return Post.findByPk(postId);
          }
        });
      },
      deletePost(root, { postId }, context) {
        return Post.destroy({
          where: {
            id: postId,
          },
        }).then((rows) => {
          if (rows === 1) {
            logger.log({
              level: 'info',
              message: `Post ${postId}was deleted`,
            });
            return {
              success: true,
            };
          }
          return {
            success: false,
          };
        }, (err) => {
          logger.log({
            level: 'error',
            message: err.message,
          });
        });
      },
      login(root, { email, password }, context) {
        return User.findAll({
          where: {
            email,
          },
          raw: true,
        }).then(async (users) => {
          if (users.length = 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(password,
              user.password);
            if (!passwordValid) {
              throw new Error('Password does not match');
            }
            const token = JWT.sign({ email, id: user.id }, JWT_SECRET, {
              expiresIn: '1d',
            });

            const cookieExpiration = 1;
            const expirationDate = new Date();
            expirationDate.setDate(
              expirationDate.getDate() + cookieExpiration,
            );
            context.cookies.set(
              'authorization',
              token, {
                signed: true,
                expires: expirationDate,
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
              },
            );

            return {
              token,
            };
          }
          throw new Error('User not found');
        });
      },
      signup(root, { email, password, username }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            throw new Error('User already exists');
          } else {
            return bcrypt.hash(
              password, 10,
            ).then(hash => User.create({
              email,
              password: hash,
              username,
              activated: 1,
            }).then((newUser) => {
              const token = JWT.sign(
                { email, id: newUser.id }, JWT_SECRET,
                { expiresIn: '1d' },
              );

              const cookieExpiration = 1;
              const expirationDate = new Date();
              expirationDate.setDate(
                expirationDate.getDate() + cookieExpiration,
              );
              context.cookies.set(
                'authorization',
                token, {
                  signed: true,
                  expires: expirationDate,
                  httpOnly: true,
                  secure: false,
                  sameSite: 'strict',
                },
              );

              return {
                token,
              };
            }));
          }
        });
      },
      async uploadAvatar(root, { file }, context) {
        const {
          stream, filename, mimetype, encoding,
        } = await file;
        const bucket = 'apollobook';
        const params = {
          Bucket: bucket,
          Key: `${context.user.id}/${filename}`,
          ACL: 'public-read',
          Body: stream,
        };

        const response = await s3.upload(params).promise();

        return User.update({
          avatar: response.Location,
        }, {
          where: {
            id: context.user.id,
          },
        }).then(() => ({
          filename,
          url: response.Location,
        }));
      },
      logout(root, params, context) {
        context.cookies.set(
          'authorization',
          '', {
            signed: true,
            expires: new Date(),
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
          },
        );
        return {
          message: true,
        };
      },
    },
    RootSubscription: {
      messageAdded: {
        subscribe: withFilter(
          () => pubsub.asyncIterator('messageAdded'),
          (payload, variables, context) => {
            if (payload.messageAdded.UserId !== context.user.id) {
              return Chat.findOne({
                where: {
                  id: payload.messageAdded.ChatId,
                },
                include: [{
                  model: User,
                  required: true,
                  through: { where: { userId: context.user.id } },
                }],
              }).then(chat => chat !== null);
            }
            return false;
          },
        ),
      },
    },
  };

  return resolvers;
}
