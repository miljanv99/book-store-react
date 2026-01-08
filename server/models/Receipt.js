import mongoose from 'mongoose';

const NUMBER = mongoose.Schema.Types.Number;
const DATE = mongoose.Schema.Types.Date;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const RECEIPT_SCHEMA = mongoose.Schema({
  user: { type: OBJECT_ID, ref: 'User' },
  productsInfo: [],
  totalPrice: { type: NUMBER, default: 0 },
  creationDate: { type: DATE, default: Date.now },
});

export const RECEIPT = mongoose.model('Receipt', RECEIPT_SCHEMA);
