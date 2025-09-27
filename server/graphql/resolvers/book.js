const { GraphQLObjectType } = require('graphql');
const BOOK = require('mongoose').model('Book');
const RECEIPT = require('mongoose').model('Receipt');

module.exports = {
  Query: {
    getAllBooks: async () => BOOK.find(),
    book: async (_, { id }) => BOOK.findById(id),
    getBooksByGenre: async (_, { genre }) => BOOK.find({ genre: genre }),
    getPopularAuthorsByGenre: async (_, { genre }) => {
      const booksByPopularity = await BOOK.find({ genre: genre }).sort({
        purchasesCount: -1,
      });

      const author = new Set();

      const result = [];

      for (const book of booksByPopularity) {
        if (!author.has(book.author)) {
          author.add(book.author);
          result.push({ author: book.author, topBook: book.title });
        }
      }

      return result;
    },
    topMostPopularBooksWithLimit: async (_, { limitNumber }) => {
      const books = await BOOK.find()
        .sort({
          purchasesCount: -1,
        })
        .limit(limitNumber);

      console.log('BOOKS: ', books);

      return books;
    },
    totalRevenue: async () => {
      const allReceipt = await RECEIPT.find();

      const totalRevenue = allReceipt.reduce(
        (sum, receipt) => sum + receipt.totalPrice,
        0
      );

      return totalRevenue;
    },
  },
};
