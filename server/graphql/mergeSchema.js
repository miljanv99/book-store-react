const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const typesArray = loadFilesSync(`${__dirname}/schema/**/*.graphql`);
const typeDefs = mergeTypeDefs(typesArray);

const resolversArray = loadFilesSync(`${__dirname}/resolvers/**/*.js`);
const resolvers = mergeResolvers(resolversArray);

module.exports = { typeDefs, resolvers };
