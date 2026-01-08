import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const connectDatabase = async (config) => {
  mongoose.connect(config.connectionString);

  const db = mongoose.connection;

  db.once('open', (err) => {
    if (err) throw err;

    console.log('MongoDB is ready!');
  });

  // Import models
  await import('../models/Cart.js');
  await import('../models/User.js');
  await import('../models/Role.js');
  await import('../models/Receipt.js');
  await import('../models/Book.js');
  await import('../models/Comment.js');
};

export default connectDatabase;
