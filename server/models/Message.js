import mongoose from 'mongoose';

const OBJECT_ID = mongoose.Schema.Types.ObjectId;
const STRING = mongoose.Schema.Types.String;
const DATE = mongoose.Schema.Types.Date;
const BOOLEAN = mongoose.Schema.Types.Boolean;

const MESSAGE_SCHEMA = mongoose.Schema(
  {
    conversation_id: { type: OBJECT_ID, ref: 'Conversation', required: true },
    senderId: { type: OBJECT_ID, ref: 'User', required: true },
    text: { type: STRING, required: true },
    read: { type: BOOLEAN, default: false },
  },
  { timestamps: true }
);

/**
 * @type {import('mongoose').Model<any>}
 */

export const MESSAGE = mongoose.model('MESSAGE', MESSAGE_SCHEMA);
