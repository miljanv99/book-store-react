import { Book } from './Book.model';

export type Cart = {
  books: Book[];
  totalPrice: number;
};
