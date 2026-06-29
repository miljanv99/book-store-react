import { User } from './User.model';

export type Conversation = {
  _id: string;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageSender: {
    _id: string;
    username: string;
  };
};
