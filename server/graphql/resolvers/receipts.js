import mongoose from 'mongoose';
import { RECEIPT } from '../../models/Receipt.js';
import { USER } from '../../models/User.js';

export default {
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
