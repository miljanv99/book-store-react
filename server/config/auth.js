import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { ROLE } from '../models/Role.js';

const verifyToken = async (req) => {
  if (!req.headers.authorization) {
    throw new Error('No authorization header');
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.BACKEND_SECRET);
    req.user = decoded.sub;
    console.log('TEST:', req.user);
  } catch (err) {
    throw new Error('Token verification failed');
  }
};

export const isAuth = async (req, res, next) => {
  try {
    await verifyToken(req);
    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};

export const isInRole = (roleName) => {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: 'You need to be logged in to access this!',
      });
    }

    try {
      const role = await ROLE.findOne({ name: roleName });

      if (!role) {
        return res.status(401).json({
          message: 'Role not found',
        });
      }

      await verifyToken(req);

      const isInRole = req.user.roles.includes(role.id);

      if (!isInRole) {
        return res.status(401).json({
          message: 'You need to be an admin to access this!',
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        message: err.message || 'Token verification failed!',
      });
    }
  };
};
