const nodemailer = require("nodemailer");
require("dotenv").config();

const emailSender = (content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_Mail_Id,
      pass: process.env.SENDER_Mail_Id_Password,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_Mail_Id, //sender mail id
    to: content.to,
    subject: content.subject,
    html: content.body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    } else {
      return info.response;
    }
  });
};

module.exports = { emailSender };
