export type Receipt = {
  _id: string;
  user: string;
  productsInfo: [
    {
      id: string;
      title: string;
      author: string;
      cover: string;
      price: number;
      qty: number;
    }
  ];
  totalPrice: number;
  creationDate: Date;
};
