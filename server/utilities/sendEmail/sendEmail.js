const { google } = require("googleapis");
require("dotenv").config();

  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  async function sendMail(resetLink, sendTo) {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    console.log("CLIENT_ID:", process.env.CLIENT_ID); 

    const rawMessage = [
      "From: Miljan <miljanv999@gmail.com>",
      `To: ${sendTo}`,
      "Subject: Request for restart password",
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      `<h1>Hello</h1><p>Restart password: ${resetLink}</p>`,
    ].join("\n");
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Message sent:", res.data.id);
  }

module.exports = sendMail;
