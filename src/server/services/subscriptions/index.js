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
  },
  {
    server,
    path: '/subscriptions',
  });
};
