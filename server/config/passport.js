import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import * as ENCRYPTION from '../utilities/encryption.js';
import dotenv from 'dotenv';

dotenv.config();

import { ROLE } from '../models/Role.js';
import { USER } from '../models/User.js';
import { CART } from '../models/Cart.js';

export const generateToken = (userInfo) => {
  const USER_PAYLOAD = {
    id: userInfo.id,
    username: userInfo.username,
    avatar: userInfo.avatar,
    isCommentsBlocked: userInfo.isCommentsBlocked,
    isAdmin: userInfo.isAdmin,
    roles: userInfo.roles,
  };

  return jwt.sign({ sub: USER_PAYLOAD }, process.env.BACKEND_SECRET, {
    expiresIn: 604800000, // 1 week in ms
  });
};

export const localRegister = () => {
  return new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = {
          username: req.body.username,
          avatar: req.body.avatar,
          email: req.body.email,
          password,
        };

        const salt = ENCRYPTION.generateSalt();
        const hashedPassword = ENCRYPTION.generateHashedPassword(
          salt,
          password
        );

        user.salt = salt;
        user.password = hashedPassword;

        const role = await ROLE.findOne({ name: 'User' });
        if (!role) return done(null, false);

        user.roles = [role._id];

        const newUser = await USER.create(user);

        role.users.push(newUser._id);
        await role.save();

        const cart = await CART.create({ user: newUser._id });
        newUser.cart = cart._id;
        await newUser.save();

        const token = generateToken(newUser);
        return done(null, token);
      } catch (err) {
        return done(null, false);
      }
    }
  );
};

export const localLogin = () => {
  return new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
        const user = await USER.findOne({ username });
        if (!user) return done(null, false);

        if (!user.authenticate(password)) return done(null, false);

        const token = generateToken(user);
        return done(null, token);
      } catch (err) {
        return done(null, false);
      }
    }
  );
};
