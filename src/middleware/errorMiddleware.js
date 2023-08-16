const constant = require("../constants/constant");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || constant.STATUS_ERROR;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
