import * as USER_CONTROLLER from '../controllers/user.js';
import * as PASSWORD_CONTROLLER from '../controllers/password.js';
import * as BOOK_CONTROLLER from '../controllers/book.js';
import * as COMMENT_CONTROLLER from '../controllers/comment.js';
import * as CART_CONTROLLER from '../controllers/cart.js';
import * as ERROR_CONTROLLER from '../controllers/error.js';
import * as AUTH from './auth.js';
import { newUserEmail } from '../utilities/sendEmail/sendEmail.js';

const setupRoutes = (APP) => {
  APP.post('/user/register', USER_CONTROLLER.register);
  APP.post('/user/login', USER_CONTROLLER.login);
  APP.post(
    '/user/authRequestRestartPassword',
    PASSWORD_CONTROLLER.authRequestRestartPassword
  );
  APP.get('/oauth2callback', PASSWORD_CONTROLLER.getAccessToken);
  APP.post('/user/restartPassword', PASSWORD_CONTROLLER.restartPassword);
  APP.post(
    '/user/accountActivation',
    AUTH.isInRole('Admin'),
    USER_CONTROLLER.createNewUser
  );
  APP.get('/user/profile/:username', AUTH.isAuth, USER_CONTROLLER.getProfile);
  APP.get(
    '/user/purchaseHistory',
    AUTH.isAuth,
    USER_CONTROLLER.getPurchaseHistory
  );
  APP.get('/user/allUsers', AUTH.isAuth, USER_CONTROLLER.getAllUsers);
  APP.get('/user/id/:userId', AUTH.isAuth, USER_CONTROLLER.getUser);
  APP.post(
    '/user/giveAdminPermission',
    AUTH.isAuth,
    USER_CONTROLLER.giveAdminPermission
  );
  APP.patch('/user/editProfile', AUTH.isAuth, USER_CONTROLLER.editProfile);
  APP.post(
    '/user/commentsPermission',
    AUTH.isInRole('Admin'),
    USER_CONTROLLER.commentsPermission
  );
  APP.post(
    '/user/commentsStatus',
    AUTH.isInRole('Admin'),
    USER_CONTROLLER.userBlockStatus
  );

  APP.get('/cart/getSize', AUTH.isAuth, CART_CONTROLLER.getCartSize);
  APP.get('/user/cart', AUTH.isAuth, CART_CONTROLLER.getCart);
  APP.post('/user/cart/add/:bookId', AUTH.isAuth, CART_CONTROLLER.addToCart);
  APP.delete(
    '/user/cart/delete/:bookId',
    AUTH.isAuth,
    CART_CONTROLLER.removeFromCart
  );
  APP.delete(
    '/user/cart/deleteAll',
    AUTH.isAuth,
    CART_CONTROLLER.removeAllFromCart
  );
  APP.post('/user/cart/checkout', AUTH.isAuth, CART_CONTROLLER.checkout);

  APP.get('/book/search', BOOK_CONTROLLER.search);
  APP.get('/book/details/:bookId', BOOK_CONTROLLER.getSingle);
  APP.post('/book/add', AUTH.isInRole('Admin'), BOOK_CONTROLLER.add);
  APP.put('/book/edit/:bookId', AUTH.isInRole('Admin'), BOOK_CONTROLLER.edit);
  APP.delete(
    '/book/delete/:bookId',
    AUTH.isInRole('Admin'),
    BOOK_CONTROLLER.deleteBook
  );
  APP.post('/book/rate/:bookId', AUTH.isAuth, BOOK_CONTROLLER.rate);
  APP.post(
    '/book/addToFavorites/:bookId',
    AUTH.isAuth,
    BOOK_CONTROLLER.addOrRemoveFavoriteBook
  );

  APP.get(
    '/comment/getLatestFiveByUser/:userId',
    AUTH.isAuth,
    COMMENT_CONTROLLER.getLatestFiveByUser
  );
  APP.get('/comment/:bookId/:skipCount', COMMENT_CONTROLLER.getComments);
  APP.post('/comment/add/:bookId', AUTH.isAuth, COMMENT_CONTROLLER.add);
  APP.put('/comment/edit/:commentId', AUTH.isAuth, COMMENT_CONTROLLER.edit);
  APP.delete(
    '/comment/delete/:commentId',
    AUTH.isAuth,
    COMMENT_CONTROLLER.deleteComment
  );

  APP.all('*', ERROR_CONTROLLER.error);
};

export default setupRoutes;
