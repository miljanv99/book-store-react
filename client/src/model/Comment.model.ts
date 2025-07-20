import { Book } from './Book.model';
import { User } from './User.model';

export type Comment = {
  _id: string;
  content: string;
  creationDate: Date;
  book: Book;
  user: User;
};
