const USER = require('mongoose').model('User');
const RECEIPT = require('mongoose').model('Receipt');
const BOOK = require('mongoose').model('Book');
module.exports = {
  Query: {
    users: async () => {
      const users = await USER.countDocuments();
      return users;
    },

    getAllUsers: async () => {
      return await USER.find();
    },

    userWithMostPurchases: async () => {
      const result = [];
      const topUsers = await USER.aggregate([
        { $addFields: { receiptsCount: { $size: '$receipts' } } },
        { $sort: { receiptsCount: -1 } },
        { $limit: 5 },
      ]);

      for (let index = 0; index < topUsers.length; index++) {
        const topUser = topUsers[index];
        const user = await USER.findById(topUser._id).populate('receipts');
        result.push({
          username: user.username,
          receiptsCount: topUser.receiptsCount,
        });
      }

      //return [{ user, receiptsCount: topUser[0].receiptsCount }];
      return result;
    },

    userWithMostComments: async () => {
      const topUser = await USER.find().sort({ commentsCount: -1 }).limit(5);
      return topUser;
    },

    userMostSpend: async () => {
      const allUsers = await USER.find();
      const result = [];

      for (const user of allUsers) {
        let sumOfSpentMoney = 0;
        for (const receiptID of user.receipts) {
          const receipt = await RECEIPT.findById(receiptID.toString());
          sumOfSpentMoney += receipt.totalPrice;
        }
        result.push({ username: user.username, totalSpent: sumOfSpentMoney });
      }

      return result.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
    },
    favoriteBooksCount: async () => {
      const allUsers = await USER.find({
        favoriteBooks: { $exists: true, $ne: [] },
      });

      let results = [];
      for (const user of allUsers) {
        for (const favoriteBooks of user.favoriteBooks) {
          let allBooks = await BOOK.find(
            { _id: favoriteBooks },
            { _id: 1, title: 1 }
          );
          for (const book of allBooks) {
            let bookId = book._id.toString();

            const isExisting = results.find(
              (res) => res._id.toString() === bookId
            );

            if (isExisting) {
              isExisting.favoriteCount += 1;
            } else {
              results.push({
                _id: book._id,
                title: book.title,
                favoriteCount: 1,
              });
            }
          }
        }
      }

      return results
        .sort((a, b) => b.favoriteCount - a.favoriteCount)
        .slice(0, 5);
    },
  },

  User: {
    receipts: async (parent) => {
      return await RECEIPT.find({ _id: { $in: parent.receipts } });
    },
    favoriteBooks: async (parent) => {
      return await BOOK.find({ _id: { $in: parent.favoriteBooks } });
    },
  },
};
