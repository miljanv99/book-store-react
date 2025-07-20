export const API_ROUTES = {
  //Book
  getAllBooks: '/book/search',
  getSingleBook: (bookId: string) => `/book/details/${bookId}`,
  addBookToFavorite: (bookId: string) => `/book/addToFavorites/${bookId}`,
  //Cart
  deleteAllFromCart: '/user/cart/deleteAll',
  removeBookFromCart: (bookId: string) => `/user/cart/delete/${bookId}`,
  getCartSize: '/cart/getSize',
  addBookToCart: (bookId: string) => `/user/cart/add/${bookId}`,
  getCartItems: '/user/cart',
  checkout: '/user/cart/checkout',
  //User
  login: '/user/login',
  register: '/user/register',
  getProfile: (username: string) => `/user/profile/${username}`,
  getPurchaseHistory: '/user/purchaseHistory'
};
