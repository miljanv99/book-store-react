const { google } = require("googleapis");
const { env } = require("process");
const readline = require("readline");
require("dotenv").config();

// execute this script in terminal in /sendEmail: node getRefreshToken.js
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URIS
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://mail.google.com/"],
  prompt: 'consent'
});

console.log("Authorize this app by visiting this url:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log("Your refresh token is:", tokens.refresh_token);
  rl.close();
});
