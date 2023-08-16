require("dotenv").config();
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const {
  welcomeTemplate,
} = require("./emailTemplate/welcomeTemplate/welcomeTemplate");
const {
  PasswordResetTemplate,
} = require("./emailTemplate/PasswordReset/passwordResetTemplate");
const constant = require("../constants/constant");
const logger = require("./logger/baseLogger");

const SENDGRID_API = process.env.SENDGRID_API_KEY;
const client = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

const sendEmail = async (to, subject, message, ccTo) => {
  const cc = ccTo ? [...ccTo] : [];
  const mailOptions = {
    from: constant.EMAIL_FROM,
    to,
    cc,
    subject,
    html: message,
  };
  client.sendMail(mailOptions, function (err, info) {
    if (err) {
      logger.error(err);
    } else {
      logger.info("Email Notification has been sent");
    }
  });
};

const generateMessage = (id, name) => {
  const staticUrl = `${process.env.API_STATIC}/asset`;
  const setPassUrl = `${process.env.ORIGIN}/${id}/setpassword`;
  const message = welcomeTemplate(name, setPassUrl, staticUrl);
  return message;
};
const generatePasswordResetMessage = (id, name) => {
  const staticUrl = `${process.env.API_STATIC}/asset`;
  const setPassUrl = `${process.env.ORIGIN}/${id}/setpassword`;
  const message = PasswordResetTemplate(name, setPassUrl, staticUrl);
  return message;
};

module.exports = {
  sendEmail,
  generateMessage,
  generatePasswordResetMessage,
};
