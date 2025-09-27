const USER = require('../../models/User');

module.exports = {
  Query: {
    users: async () => USER.find(),
  },
};
