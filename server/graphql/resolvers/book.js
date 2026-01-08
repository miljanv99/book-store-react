import mongoose from 'mongoose';
import { BOOK } from '../../models/Book.js';
import { RECEIPT } from '../../models/Receipt.js';
import { USER } from '../../models/User.js';

export default {
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
      const booksByPopularity = await BOOK.find({ genre }).sort({
        purchasesCount: -1,
      });

      const authors = new Set();
      const result = [];

      for (const book of booksByPopularity) {
        if (!authors.has(book.author)) {
          authors.add(book.author);
          result.push({ author: book.author, topBook: book.title });
        }
      }

      return result;
    },

    getSalesByAuthor: async () => {
      const books = await BOOK.find();
      const results = [];

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
      return results.slice(0, 8);
    },

    topMostPopularBooksWithLimit: async (_, { limitNumber }) => {
      return await BOOK.find().sort({ purchasesCount: -1 }).limit(limitNumber);
    },

    totalRevenue: async () => {
      const allReceipts = await RECEIPT.find();
      return allReceipts.reduce((sum, receipt) => sum + receipt.totalPrice, 0);
    },

    getNumberOfBooksByGenre: async () => {
      const books = await BOOK.find();
      const results = [];

      for (const book of books) {
        const existing = results.find((res) => res.genre === book.genre);
        if (existing) {
          existing.count += 1;
        } else {
          results.push({ genre: book.genre, count: 1 });
        }
      }

      return results;
    },

    revenuePerBook: async () => {
      const books = await BOOK.find();
      const result = books.map((book) => ({
        title: book.title,
        revenue: book.purchasesCount * book.price,
      }));
      return result.sort((a, b) => b.revenue - a.revenue);
    },

    booksWithTheFewestPurchases: async () => {
      return await BOOK.find().sort({ purchasesCount: 1 }).limit(5);
    },
  },

  Book: {
    ratedBy: async (parent) => USER.find({ _id: { $in: parent.ratedBy } }),
  },
};
