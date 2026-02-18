export type Book = {
  _id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  currentRating: number;
  ratingPoints?: number;
  ratedCount?: number;
  ratedBy: string[];
  purchasesCount?: number;
  genre: string;
  year: number;
  isbn: string;
  pagesCount: number;
  price: number;
  creationDate: Date;
  quantity?: number;
};
