import { google } from 'googleapis';
import 'dotenv/config';
import oAuth2Client from '../../config/googleClient.js';
import nodemailer from 'nodemailer';

export async function restartPasswordMail(resetLink, sendTo, refreshToken) {
  oAuth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  console.log('CLIENT_ID:', process.env.CLIENT_ID);

  const rawMessage = [
    'From: Miljan <miljanv999@gmail.com>',
    `To: ${sendTo}`,
    'Subject: Request for restart password',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    `<h1>Hello</h1><p>Restart password: ${resetLink}</p>`,
  ].join('\n');
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log('Message sent:', res.data.id);
}

export async function newUserEmail(
  email,
  username,
  generatedPassword,
  restartPasswordURL
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miljanv999@gmail.com',
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  console.log('Reset link:', restartPasswordURL);

  const response = await transporter.sendMail({
    from: 'miljanv999@gmail.com',
    to: email,
    subject: 'Account Activation',
    html: `<p>Our Admin created you an account for our book store.</p>

      <p>
        <strong>Username:</strong> ${username}<br/>
        <strong>Password:</strong> ${generatedPassword}
      </p>

      <p>
        You can also re-create your password:
        <br/>
        <p>
          ${restartPasswordURL}
        </p>
      </p>`,
  });

  console.log('Email message ID: ', response.messageId);
  console.log('Email envelope: ', response.envelope);
}
