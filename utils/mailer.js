// utils/mailer.js
const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: "gmail", // or use host, port, secure, auth for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your Gmail or SMTP user
    pass: process.env.EMAIL_PASS, // your Gmail or SMTP password (app password for Gmail)
  },
  tls: {
    rejectUnauthorized: false, // Ensure it's allowed to use Gmail's TLS
  },
});

const sendOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Password Reset OTP",
    text: `Your OTP(One Time Password) is ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};



  module.exports = sendOTP;

