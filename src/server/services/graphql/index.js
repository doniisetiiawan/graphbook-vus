import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import * as dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import Resolvers from './resolvers';
import Schema from './schema';
import auth from './auth';

dotenv.config();
const { JWT_SECRET, ENGINE_API_KEY } = process.env;

export default (utils) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth,
    },
  });

  return new ApolloServer({
    schema: executableSchema,
    engine: {
      apiKey: ENGINE_API_KEY,
      generateClientInfo: ({
        request,
      }) => {
        const { headers } = request.http;
        const clientName = headers.get('apollo-client-name');
        const clientVersion = headers.get('apollo-client-version');

        if (clientName && clientVersion) {
          return {
            clientName,
            clientVersion,
          };
        }
        return {
          clientName: 'Unknown Client',
          clientVersion: 'Unversioned',
        };
      },
    },
    cacheControl: {
      defaultMaxAge: 5,
      stripFormattedExtensions: false,
      calculateCacheControlHeaders: true,
    },
    context: async ({ req }) => {
      const { authorization } = req.headers;
      if (typeof authorization !== typeof undefined) {
        const search = 'Bearer';
        const regEx = new RegExp(search, 'ig');
        const token = authorization.replace(regEx, '').trim();
        return JWT.verify(token, JWT_SECRET, (err, result) => {
          if (err) {
            return req;
          }
          return utils.db.models.User.findByPk(
            result.id,
          ).then(user => Object.assign({}, req, { user }));
        });
      }
      return req;
    },
  });
};
