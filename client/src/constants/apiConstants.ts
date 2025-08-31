export const API_ROUTES = {
  //Book
  getAllBooks: '/book/search',
  getSingleBook: (bookId: string) => `/book/details/${bookId}`,
  addBookToFavorite: (bookId: string) => `/book/addToFavorites/${bookId}`,
  rateBook: (bookId: string) => `/book/rate/${bookId}`,
  addBook: '/book/add',
  deleteBook: (bookId: string) => `/book/delete/${bookId}`,
  editBook: (bookId: string) => `/book/edit/${bookId}`,
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
  requestRestartPassword: '/user/requestRestartPassword',
  restartPassword: (token: string, userId: string) =>
    `/user/restartPassword?token=${token}&id=${userId}`,
  getProfile: (username: string) => `/user/profile/${username}`,
  editProfile: '/user/editProfile',
  getPurchaseHistory: '/user/purchaseHistory',
  commentsStatus: '/user/commentsStatus',
  commentsPermission: '/user/commentsPermission',
  getAllUsers: '/user/allUsers',
  adminPermission: '/user/giveAdminPermission',
  //Comment
  getComments: (bookId: string, skipCount: number) => `/comment/${bookId}/${skipCount}`,
  addComment: (bookId: string) => `/comment/add/${bookId}`,
  deleteComment: (commentId: string) => `/comment/delete/${commentId}`,
  editComment: (commentId: string) => `/comment/edit/${commentId}`
};
