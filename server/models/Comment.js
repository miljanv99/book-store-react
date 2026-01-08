import mongoose from 'mongoose';

const STRING = mongoose.Schema.Types.String;
const DATE = mongoose.Schema.Types.Date;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const COMMENT_SCHEMA = mongoose.Schema({
  user: { type: OBJECT_ID, ref: 'User' },
  book: { type: OBJECT_ID, ref: 'Book' },
  content: { type: STRING, required: true },
  creationDate: { type: DATE, default: Date.now },
});

export const COMMENT = mongoose.model('Comment', COMMENT_SCHEMA);
