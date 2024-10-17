export type Book = {
  _id?: string;
  title?: string;
  author?: string;
  cover?: string;
  description?: string;
  currentRating?: number;
  ratingPoints?: number;
  retedCount?: number;
  //ratedBy?:
  purchasesCount?: number;
  //comments?:
  genre?: string;
  year?: number;
  isbn?: string;
  pagesCount?: number;
  price?: number;
  creationDate?: Date;
};
