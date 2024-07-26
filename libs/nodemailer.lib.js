const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    // type: 'OAuth2',       //configuraciones OAuth2 de google
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    // clientId: process.env.CLIENTID, //configuraciones OAuth2 de google
    // clientSecret: process.env.CLIENT_SECRET, //configuraciones OAuth2 de google
    // refreshToken: process.env.REFRESH_TOKEN //configuraciones OAuth2 de google
  },
});

module.exports = transporter;
