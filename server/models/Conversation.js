import mongoose from 'mongoose';

const OBJECT_ID = mongoose.Schema.Types.ObjectId;
const STRING = mongoose.Schema.Types.String;
const DATE = mongoose.Schema.Types.Date;

const CONVERSATION_SCHEMA = mongoose.Schema(
  {
    participants: [{ type: OBJECT_ID, ref: 'User' }],
    lastMessage: { type: STRING },
    lastMessageAt: { type: DATE },
    lastMessageSender: { type: OBJECT_ID, ref: 'User' },
  },
  { timestamps: true }
);

/**
 * @type {import('mongoose').Model<any>}
 */

export const CONVERSATION = mongoose.model('Conversation', CONVERSATION_SCHEMA);
