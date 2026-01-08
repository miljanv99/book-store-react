import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';

import { localRegister, localLogin } from './passport.js';

const registerStrategy = localRegister();
const loginStrategy = localLogin();

const setupExpress = (APP) => {
  APP.use(bodyParser.urlencoded({ extended: true }));
  APP.use(bodyParser.json());
  APP.use(cors());
  APP.use(passport.initialize());

  passport.use('local-register', registerStrategy);
  passport.use('local-login', loginStrategy);
};

export default setupExpress;
