import { google } from 'googleapis';
import 'dotenv/config';
import oAuth2Client from '../../config/googleClient.js';

export async function sendMail(resetLink, sendTo, refreshToken) {
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
