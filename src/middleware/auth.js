const jwt = require("jsonwebtoken");
const userModel = require("../modules/users/model");
const constant = require("../constants/constant");
const logger = require("../utility/logger/baseLogger");
const { customResponse } = require("../utility/helper");

const isAuthorized = async (req, res, next) => {
  if (process.env.NODE_ENV == constant.ENV_TEST) {
    next();
    return;
  }
  let code, message;
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const secret = process.env.JWT_SECRET;
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    try {
      jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
          code = 401;
          message = err.message;
          const resData = customResponse({
            code,
            message,
            err,
          });
          return res.status(code).send(resData);
        }
        const user = await userModel.findOne({ token: token });
        if (!user) {
          code = 401;
          message = constant.TOKEN_INVALID_MSG;
          const resData = customResponse({
            code,
            message,
          });
          return res.status(code).send(resData);
        }
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        next();
      });
    } catch (error) {
      code = 401;
      message = constant.TOKEN_INVALID_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
  } else {
    code = 401;
    message = constant.AUTHENTICATION_ERR_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (process.env.NODE_ENV == constant.ENV_TEST) {
        next();
        return;
      }
      let code, message;
      let hasAccess = false;
      req.decoded.permissions.includes(permission) && (hasAccess = true);
      if (hasAccess) {
        next();
      } else {
        code = 401;
        message = constant.NOT_AUUTH_FOR_ROUTE_MSG;
        const resData = customResponse({ code, message });
        return res.status(code).send(resData);
      }
    } catch (error) {
      code = 500;
      logger.error(error)
      message = constant.SERVER_ERR;
      const resData = customResponse({ code, message, error });
      return res.status(code).send(resData);
    }
  };
};
module.exports = { isAuthorized, hasPermission };
