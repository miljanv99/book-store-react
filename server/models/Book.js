import mongoose from 'mongoose';

const STRING = mongoose.Schema.Types.String;
const DATE = mongoose.Schema.Types.Date;
const NUMBER = mongoose.Schema.Types.Number;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const BOOK_SCHEMA = mongoose.Schema({
  title: { type: STRING, required: true },
  author: { type: STRING, required: true },
  genre: { type: STRING, required: true },
  year: { type: NUMBER, required: true },
  description: { type: STRING, required: true },
  cover: { type: STRING, required: true },
  isbn: { type: STRING, required: true },
  pagesCount: { type: NUMBER, required: true },
  price: { type: NUMBER, required: true },
  creationDate: { type: DATE, default: Date.now },
  currentRating: { type: NUMBER, default: 0 },
  ratingPoints: { type: NUMBER, default: 0 },
  ratedCount: { type: NUMBER, default: 0 },
  ratedBy: [{ type: OBJECT_ID, ref: 'User' }],
  purchasesCount: { type: NUMBER, default: 0 },
  comments: [{ type: OBJECT_ID, ref: 'Comment' }],
});

BOOK_SCHEMA.index({
  title: 'text',
  author: 'text',
  genre: 'text',
  isbn: 'text',
});

export const BOOK = mongoose.model('Book', BOOK_SCHEMA);
