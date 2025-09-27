const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const { typeDefs, resolvers } = require('./mergeSchema');

module.exports = async (APP) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // Apply middleware
  APP.use('/graphql', expressMiddleware(apolloServer));
};
