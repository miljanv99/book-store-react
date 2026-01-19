export const ROUTES = {
  HOME: '/',
  STORE: '/store',
  CART: '/cart',
  BOOK_DETAILS: '/bookDetails/:bookId',
  BOOK_DETAILS_DYNAMIC_PATH: (bookId: string) => `/bookDetails/${bookId}`,
  PROFILE: '/profile/:username',
  RESTART_PASSWORD: '/restartPassword',
  ANALYTICS: '/analytics',
  USERS_LIST: {
    USERS: '/users',
    USER_DETAILS: ':userId',
    USERS_LIST_FULL_PATH: '/users/:userId',
    USER_DETAILS_DYNAMIC_PATH: (userId: string) => `/users/${userId}`
  },
  ADD_NEW_USER: '/user/accountActivation'
};
