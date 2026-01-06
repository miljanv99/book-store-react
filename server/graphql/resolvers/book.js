const BOOK = require('mongoose').model('Book');
const RECEIPT = require('mongoose').model('Receipt');
const USER = require('mongoose').model('User');

module.exports = {
  Query: {
    getAllBooks: async () => BOOK.find(),
    oneBook: async (_, { id }) => BOOK.findById(id),
    oneUser: async (_, { id }) => USER.findById(id),
    bestRatedBooksByGenre: async () => {
      const result = [];
      const allBooks = await BOOK.find().sort({ currentRating: -1 });

      for (const book of allBooks) {
        const isExisting = result.find((res) => book.genre === res.genre);

        if (isExisting) {
          if (isExisting.books.length < 5) {
            isExisting.books.push(book);
          }
        } else {
          result.push({
            genre: book.genre,
            books: [book],
          });
        }
      }
      return result;
    },
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

    getSalesByAuthor: async () => {
      const books = await BOOK.find();

      let results = [];
      for (const book of books) {
        const existing = results.find((r) => r.author === book.author);

        if (existing) {
          existing.totalPurchases += book.purchasesCount;
        } else {
          results.push({
            author: book.author,
            totalPurchases: book.purchasesCount,
          });
        }
      }

      results.sort((a, b) => b.totalPurchases - a.totalPurchases);
      const top8 = results.slice(0, 8);

      return top8;
    },

    topMostPopularBooksWithLimit: async (_, { limitNumber }) => {
      const books = await BOOK.find()
        .sort({
          purchasesCount: -1,
        })
        .limit(limitNumber);

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

    getNumberOfBooksByGenre: async () => {
      const books = await BOOK.find();
      let results = [];

      for (const book of books) {
        const isExisting = results.find((res) => res.genre === book.genre);

        if (isExisting) {
          isExisting.count += 1;
        } else {
          results.push({ genre: book.genre, count: 1 });
        }
      }

      return results;
    },

    revenuePerBook: async () => {
      const books = await BOOK.find();
      let result = [];
      for (const book of books) {
        let revenue = 0;
        revenue = book.purchasesCount * book.price;
        result.push({ title: book.title, revenue: revenue });
      }
      return result.sort((a, b) => b.revenue - a.revenue);
    },

    booksWithTheFewestPurchases: async () => {
      const books = await BOOK.find().sort({ purchasesCount: 1 }).limit(5);

      return books;
    },
  },

  Book: {
    ratedBy: async (parent) => {
      return await USER.find({ _id: { $in: parent.ratedBy } });
    },
  },
};
