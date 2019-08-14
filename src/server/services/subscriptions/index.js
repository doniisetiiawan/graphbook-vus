import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import * as dotenv from 'dotenv';
import Resolvers from '../graphql/resolvers';
import Schema from '../graphql/schema';
import auth from '../graphql/auth';

dotenv.config();
const { JWT_SECRET } = process.env;

export default utils => (server) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth,
    },
  });

  new SubscriptionServer({
    execute,
    subscribe,
    schema: executableSchema,
    onConnect: async (params, socket) => {
      const authorization = params.authToken;
      if (typeof authorization !== typeof undefined) {
        const search = 'Bearer';
        const regEx = new RegExp(search, 'ig');
        const token = authorization.replace(regEx, '').trim();
        return jwt.verify(token, JWT_SECRET, (err, result) => {
          if (err) {
            throw new Error('Missing auth token!');
          } else {
            return utils.db.models.User.findByPk(result.id)
              .then(user => Object.assign({}, socket.upgradeReq, { user }));
          }
        });
      }
      throw new Error('Missing auth token!');
    },
  },
  {
    server,
    path: '/subscriptions',
  });
};
