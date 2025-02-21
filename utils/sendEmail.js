const transporter = require('../config/nodemailer');

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};

module.exports = sendEmail;