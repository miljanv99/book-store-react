import mongoose from 'mongoose';

import { USER } from '../models/User.js';
import { CART } from '../models/Cart.js';
import {
  generateHashedPassword,
  generateSalt,
} from '../utilities/encryption.js';

const STRING = mongoose.Schema.Types.String;
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const ROLE_SCHEMA = mongoose.Schema({
  name: { type: STRING, required: true, unique: true },
  users: [{ type: OBJECT_ID, ref: 'User' }],
});

export const ROLE = mongoose.model('Role', ROLE_SCHEMA);

export const init = async () => {
  try {
    let adminRole = await ROLE.findOne({ name: 'Admin' });
    if (!adminRole) {
      adminRole = await ROLE.create({ name: 'Admin' });

      const salt = generateSalt();
      const passwordHash = generateHashedPassword(salt, 'admin');

      const adminUser = await USER.create({
        username: 'admin',
        email: 'admin@admin.com',
        salt,
        password: passwordHash,
        isAdmin: true,
        roles: [adminRole._id],
      });

      adminRole.users.push(adminUser._id);
      await adminRole.save();

      const adminCart = await CART.create({ user: adminUser._id });
      adminUser.cart = adminCart._id;
      await adminUser.save();
    }

    let userRole = await ROLE.findOne({ name: 'User' });
    if (!userRole) {
      userRole = await ROLE.create({ name: 'User' });

      const salt = generateSalt();
      const passwordHash = generateHashedPassword(salt, '123');

      const normalUser = await USER.create({
        username: 'jeliozver',
        email: 'jeliozver@gmail.com',
        salt,
        password: passwordHash,
        roles: [userRole._id],
      });

      userRole.users.push(normalUser._id);
      await userRole.save();

      const userCart = await CART.create({ user: normalUser._id });
      normalUser.cart = userCart._id;
      await normalUser.save();
    }
  } catch (err) {
    console.error('Error initializing roles and users:', err);
  }
};
