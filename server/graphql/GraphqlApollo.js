import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { typeDefs, resolvers } from './mergeSchema.js';

export default async (APP) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // Apply middleware
  APP.use('/graphql', expressMiddleware(apolloServer));
};
