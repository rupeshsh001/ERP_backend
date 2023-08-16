const constant = require("../constants/constant");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    if (process.env.NODE_ENV === constant.ENV_PRODUCTION) this.prodMessage = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? constant.STATUS_FAIL : constant.STATUS_ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
