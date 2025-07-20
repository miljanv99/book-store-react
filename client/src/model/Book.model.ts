export type Book = {
  _id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  currentRating: number;
  ratingPoints?: number;
  ratedCount?: number;
  //ratedBy:
  purchasesCount?: number;
  comments?: Comment[];
  genre: string;
  year: number;
  isbn?: string;
  pagesCount: number;
  price: number;
  creationDate?: Date;
  quantity?: number;
};
