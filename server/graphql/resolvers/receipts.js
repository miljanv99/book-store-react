const RECEIPT = require('mongoose').model('Receipt');
const USER = require('mongoose').model('User');

module.exports = {
  Query: {
    recentPurchases: async () => {
      const recentReceipts = await RECEIPT.find()
        .sort({ creationDate: -1 })
        .limit(10);

      return recentReceipts;
    },
  },

  Receipt: {
    username: async (parent) => {
      const userId = parent.user;

      const user = await USER.findById(userId);

      return user.username;
    },
  },
};
