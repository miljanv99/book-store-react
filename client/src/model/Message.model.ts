import { Conversation } from './Conversation.model';

export type Message = {
  _id: string;
  conversation_id: Conversation;
  senderId: {
    _id: string;
    username: string;
    avatar: string;
  };
  text: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
};
