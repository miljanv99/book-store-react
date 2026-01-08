import mongoose from 'mongoose';
import { generateToken } from '../config/passport.js';
import {
  generateHashedPassword,
  generateSalt,
} from '../utilities/encryption.js';
import { sendMail } from '../utilities/sendEmail/sendEmail.js';
import jwt from 'jsonwebtoken';
import oAuth2Client from '../config/googleClient.js';
import 'dotenv/config';
import { USER } from '../models/User.js';

export const authRequestRestartPassword = async (req, res) => {
  const email = req.body.email;
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/'],
    prompt: 'consent',
    state: encodeURIComponent(email),
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  console.log('ENCODED: ', encodeURIComponent(email));

  return res.status(200).json({
    message: `Authorize this app by visiting this url: ${authUrl}`,
    data: authUrl,
  });
};

export const getAccessToken = async (req, res) => {
  const code = req.query.code;
  const email = decodeURIComponent(req.query.state);
  console.log('Authorization code:', code);
  const { tokens } = await oAuth2Client.getToken(code);
  const refreshToken = tokens.refresh_token;

  console.log('DECODED: ', email);

  if (refreshToken) {
    const user = await USER.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const token = generateToken(user);

    const resetLink = `http://localhost:5173/restartPassword?token=${token}&id=${user._id}`;

    await sendMail(resetLink, email, refreshToken);
    res.send(
      'Authorization successful! We sent you link to restart you password on email.'
    );
  }
};

export const restartPassword = async (req, res) => {
  const { token, id } = req.query;
  const newPassword = req.body.password;

  const decoded = jwt.verify(token, process.env.BACKEND_SECRET);

  try {
    if (!newPassword) {
      return res.status(400).json({ message: 'Please provide password field' });
    }

    if (decoded.sub.id !== id) {
      return res.status(400).json({ message: 'Invalid token or user ID' });
    }
    const user = await USER.findById(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    let salt = generateSalt();
    let hashedPassword = generateHashedPassword(salt, newPassword);

    user.password = hashedPassword;
    user.salt = salt;
    console.log('Generated salt: ', salt);
    console.log('Hashed password: ', hashedPassword);
    await user.save();

    return res.json({ message: 'Password successfully reset!' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
