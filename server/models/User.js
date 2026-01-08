import mongoose from 'mongoose';

import { generateHashedPassword } from '../utilities/encryption.js';
const STRING = mongoose.Schema.Types.String;
const NUMBER = mongoose.Schema.Types.Number;
const BOOLEAN = mongoose.Schema.Types.Boolean;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const USER_SCHEMA = mongoose.Schema({
  username: { type: STRING, required: true, unique: true },
  email: { type: STRING, required: true, unique: true },
  avatar: { type: STRING, default: 'https://i.imgur.com/4s5qLzU.png' },
  password: { type: STRING, required: true },
  salt: { type: STRING, required: true },
  isAdmin: { type: BOOLEAN, default: false },
  isCommentsBlocked: { type: BOOLEAN, default: false },
  commentsCount: { type: NUMBER, default: 0 },
  roles: [{ type: OBJECT_ID, ref: 'Role' }],
  cart: { type: OBJECT_ID, ref: 'Cart' },
  receipts: [{ type: OBJECT_ID, ref: 'Receipt' }],
  favoriteBooks: [{ type: OBJECT_ID, ref: 'Book' }],
});

USER_SCHEMA.method({
  authenticate: function (password) {
    let hashedPassword = generateHashedPassword(this.salt, password);

    if (hashedPassword === this.password) {
      return true;
    }
    return false;
  },
});

export const USER = mongoose.model('User', USER_SCHEMA);
