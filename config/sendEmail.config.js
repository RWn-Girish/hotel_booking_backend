const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendEmail = async (message) => {
    let response = await transporter.sendMail(message);
    console.log("Res ====> ", response);
    return response;
}

module.exports = sendEmail;