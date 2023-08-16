const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { Employee } = require("../modules/employee/model");
const AppError = require("../utility/appError");

const constant = require("../constants/constant");

exports.checkAndAssignRole = async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(constant.USER_NOT_EXIST_MSG, 401));
  }
  // 2) Decode token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET.trim()
  );

  // 3) Check if employee still exists
  const loggedEmployee = await Employee.findOne({ email: decoded.email });
  if (!loggedEmployee) {
    return next(new AppError(constant.EMP_TOKEN_ERR_MSG, 401));
  }

  //Grant access to the protected raoutes
  req.role = loggedEmployee.role; //this is important to store current employee data

  next();
};

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    //roles is an array ex ['user','admin']
    if (!roles.includes(req.role)) {
      return next(new AppError(constant.NO_PERMISSION_ERR_MSG, 403));
    }

    next();
  };
};
