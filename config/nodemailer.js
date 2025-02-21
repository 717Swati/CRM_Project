const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.gmail.com'
    auth: {
        user: process.env.EMAIL_USER, // Make sure this is set
        pass: process.env.EMAIL_PASS  // Make sure this is set
    }
});

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

module.exports = transporter;