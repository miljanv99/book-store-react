import mongoose from 'mongoose';

const NUMBER = mongoose.Schema.Types.Number;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const CART_SCHEMA = mongoose.Schema({
  user: { type: OBJECT_ID, ref: 'User' },
  books: [{ type: OBJECT_ID, ref: 'Book' }],
  totalPrice: { type: NUMBER, default: 0 },
});

/**
 * @type {import('mongoose').Model<any>}
 */

export const CART = mongoose.model('Cart', CART_SCHEMA);
