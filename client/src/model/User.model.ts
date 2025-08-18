import { Book } from './Book.model';
import { Cart } from './Cart.model';
import { Receipt } from './Receipts.model';

export type User = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isCommentsBlocked: boolean;
  commentsCount: number;
  receipts: Receipt[];
  favoriteBooks: Book[];
  cart: Cart;
};
