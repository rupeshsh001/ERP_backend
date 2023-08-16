const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const { addUserSchema, loginSchema, importUserSchema } = require("./schema");
const { customResponse, customPagination } = require("../../utility/helper");
const rolesModal = require("../roles/model");
const userModel = require("./model");
const {
  sendEmail,
  generateMessage,
  generatePasswordResetMessage,
} = require("../../utility/AutogenerateEmail");
const { OAuth2Client } = require("google-auth-library");
const constant = require("../../constants/constant");

const client = new OAuth2Client();

const getUserList = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users list'
      #swagger.parameters['page'] = {
        in: 'query',
        type: 'integer',
        description: 'Page number'
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        type: 'integer',
        description: 'Data limit per page'
      }
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "pageCount": 1,
            "totalCount": 1,
            "currentPage": 1,
            "results": [
              {
                "_id": "610d090636ba149966bd3b55",
                "firstName": "Jhon",
                "lastName": "Doe",
                "email": "jhon@valuebound.com",
                "role": "admin"
              }
            ]
          },
          "error": {}
        }
      }
  */

  let code, message;
  const searchString = [{ role: { $regex: "" } }];

  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 15;
  if (req.query.firstName) {
    searchString.push({ firstName: { $regex: req.query.firstName } });
  }
  if (req.query.lastName) {
    searchString.push({ lastName: req.query.lastName });
  }
  if (req.query.email) {
    searchString.push({ email: req.query.email });
  }
  try {
    code = constant.HTTP_200_CODE;
    const users = await userModel.find({
      $and: [{ $and: searchString }],
    });
    const data = customPagination({ data: users, page, limit });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const getUserDeatil = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users Detail'
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data":  {
            "_id": "610bc1b31b82a66f6bcd64ea",
            "firstName": "akash",
            "lastName": "kumar",
            "email": "akash@gmail.com",
            "role": "admin",
            "__v": 0
          },
          "error": {}
        }
      }
  */

  let code, message;
  const _id = req.params.id;
  try {
    code = constant.HTTP_200_CODE;
    const data = await userModel.findById({ _id });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const createUserWhileImport = async (req, res) => {
  let importedData;

  /*
  make sure req.body is an aaray object of user data with email should be in empEmail field and name should be in empName field.. check below example
  example:-req.body= [{
    "empEmail": "email",
    "empName": "name"
  }]
  */
  //check array
  if (!Boolean(req.body instanceof Array))
    return res.status(constant.HTTP_400_CODE).send({
      code: constant.HTTP_400_CODE,
      message: constant.INVALID_DATA_MSG,
    });

  //data conversion according to User schema
  importedData = req.body.map((user) => {
    return {
      firstName: user.name,
      email: user.email,
      password: nanoid(5),
      role: ["user"],
    };
  });

  try {
    //check joi validation
    let arrayOfJoiError = [];
    importedData.forEach((user, index) => {
      const { error } = importUserSchema.validate(user);
      if (error)
        arrayOfJoiError.push({
          index,
          validationError: error?.details.map((el) => el.message),
        });
    });
    if (arrayOfJoiError.length) {
      let code = constant.HTTP_206_CODE;
      let errorName = constant.JOI_ERROR;
      let message = constant.INADEQUATE_DATA_MSG;
      const resData = customResponse({
        code,
        status: constant.STATUS_ERROR,
        message,
        error: {
          errorName,
          importError: arrayOfJoiError,
        },
      });
      return res.status(code).send(resData);
    }

    //create user also handle errors
    let UsersResult = [];
    let importError = [];

    for (let i = 0; i < req.body.length; i++) {
      try {
        const result = await new userModel(importedData[i]);
        await result.save();
        UsersResult.push({ index: i, message: result });
        const emailMessage = generateMessage(result._id, result.firstName);
        sendEmail(
          result.email,
          `Oneplace Account:Account Creation`,
          emailMessage
        );
      } catch (err) {
        importError.push({
          index: i,
          message: `Account already created for email, ${err.keyValue.email}`,
        });
      }
    }

    return res.status(constant.HTTP_201_CODE).send({
      code: constant.HTTP_201_CODE,
      status: importError.length
        ? UsersResult.length
          ? constant.STATUS_WARNING
          : constant.STATUS_ERROR
        : constant.STATUS_SUCCESS,
      message: importError.length
        ? UsersResult.length
          ? constant.FEW_USERS_DATA_NOT_CREATED_MSG
          : constant.FAILED_CREATE_USERS_DATA_MSG
        : constant.USERS_DATA_CREATED_SUCCESS_MSG,
      data: UsersResult,
      error: importError.length
        ? { errorName: constant.MONGO_ERROR, importError }
        : { errorName: null, importError: [] },
    });
  } catch (error) {
    let code = constant.HTTP_400_CODE;
    let message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const addUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $firstName: 'Jhon',
            $lastName: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "firstName": 'Jhon',
            "lastName": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin',
          },
          "error": {}
        }
      }
  */
  let code, message;
  const { error } = addUserSchema.validate(req.body);
  if (error) {
    code = constant.HTTP_422_CODE;
    message = constant.INVALID_REQ_DATA_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
  try {
    code = constant.HTTP_201_CODE;
    const firstname = req.body.firstName.split(" ")[0];
    const lastname = req.body.firstName.split(" ")[1];
    req.body.firstName = firstname;
    req.body.lastName = lastname;
    const data = new userModel(req.body);
    await data.save();
    const emailMessage = generateMessage(data._id, data.firstName);
    sendEmail(data.email, `Oneplace Account:Account Creation`, emailMessage);
    const resData = customResponse({
      code,
      data,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Update user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $firstName: 'Jhon',
            $lastName: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[200] = {
        description: 'User successfully updated.',
        schema: {
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "firstName": 'Jhon',
            "lastName": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin'
          },
          "error": {}
        }
      }
  */
  let code, message;
  const _id = req.params.id;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.USER_UPDATED_SUCCESS_MSG;
    await userModel
      .findOneAndUpdate({ _id }, { ...req.body }, { new: true })
      .then((user) => {
        const resData = customResponse({
          code,
          data: user,
          message,
        });
        return res.status(code).send(resData);
      });
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateUserByEmail = async (req, res) => {
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.USER_UPDATED_SUCCESS_MSG;
    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.params.email },
      { ...req.body },
      { new: true }
    );

    const resData = customResponse({
      code,
      status: constant.STATUS_SUCCESS,
      data: updatedUser,
      message,
    });

    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const deleteUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Delete user'
      #swagger.responses[200] = {
      schema:{
        "status": "success",
        "code": 200,
        "message": "User deleted successfully",
        "data":  {
          "_id": "610bc1b31b82a66f6bcd64ea",
          "firstName": 'Jhon',
          "lastName": 'Doe',
          "email": 'jhon@valuebound.com',
          "role": 'admin',
          "__v": 0
        },
        "error": {}
      }
    }
  */
  let code, message;
  const _id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isValid) {
    code = constant.HTTP_422_CODE;
    message = constant.INVALID_OBJ_ID_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    code = constant.HTTP_200_CODE;
    const user = await userModel.findByIdAndDelete({ _id });
    message = constant.USER_DELETED_SUCCESS_MSG;
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};
const auth = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $firstName: 'Jhon',
            $lastName: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;

  let googleVerified = false;
  if (req.body.idToken != " ") {
    await client
      .verifyIdToken({
        idToken: req.body.idToken,
        audience: [
          process.env.CLIENT_ID_ANDROID_MOBILE,
          process.env.CLIENT_ID_WEBSITE,
          process.env.CLIENT_ID_OTHER,
          process.env.ANDROID_EXPO_PROXY,
        ],
      })
      .then((res) => {
        googleVerified = true;
        req.body.email = res.payload.email;
      });
  }

  try {
    const userStatus = await userModel.findOne({ email: req.body.email });
    if (userStatus.status !== constant.STATUS_ACTIVE) {
      code = constant.HTTP_422_CODE;
      message = constant.USER_DEACTIVATED_MSG;
      return res.status(code).json({
        code,
        status: constant.STATUS_ERROR,
        message,
        data: userStatus,
      });
    }
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.INVALID_REQ_DATA_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }

  const { error } = loginSchema.validate(req.body);
  if (error) {
    code = constant.HTTP_422_CODE;
    message = constant.INVALID_REQ_DATA_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }

  try {
    code = constant.HTTP_200_CODE;
    let payload = { ...req.body };
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    const secret = process.env.JWT_SECRET;
    const user = await userModel
      .findOne({ email: { $regex: req.body.email, $options: "i" } })
      .collation({ locale: constant.LOCALE, strength: 2 })
      .exec();
    const userRole = user.role;
    let rolesData;
    let permissions = [];
    let userPermission;
    const userDetail = {};
    await Promise.all(
      user.role.map(async (role) => {
        rolesData = await rolesModal
          .find({ label: role })
          .then(function (rolesData) {
            userPermission = rolesData[0].permissions;
            permissions.push(...userPermission);
          });
      })
    );
    payload = {
      ...payload,
      permissions: [...new Set(permissions)],
      roles: userRole,
    };
    const token = jwt.sign(payload, secret, options);
    const reqBody = { token, ...req.body };
    if (!user) {
      code = constant.HTTP_404_CODE;
      message = constant.INVALID_REQ_DATA_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      const userEntry = await userModel
        .findOne({
          email: { $regex: req.body.email, $options: "i" },
        })
        .collation({ locale: constant.LOCALE, strength: 2 });
      let doesPasswordMatch;
      if (!googleVerified || req?.query?.source !== "google") {
        doesPasswordMatch = await bcrypt.compare(
          req.body.password,
          userEntry.password
        );
      }
      if (
        doesPasswordMatch ||
        googleVerified ||
        req?.query?.source === "google"
      ) {
        code = constant.HTTP_200_CODE;
        reqBody.password = userEntry.password;
        await userModel
          .findOneAndUpdate(
            { email: { $regex: req.body.email, $options: "i" } },
            { $push: { token: token } },
            { new: true }
          )
          .then((data) => {
            userDetail.name = data.firstName;
            userDetail.email = data.email;
            userDetail.roles = data.role;
            userDetail.permissions = [...new Set(permissions)];
            userDetail.token = "Bearer " + token;
            userDetail.id = data._id.toString();
          });
      } else {
        code = constant.HTTP_422_CODE;
        message = constant.INVALID_REQ_DATA_MSG;
        const resData = customResponse({
          code,
          message,
        });
        return res.status(code).send(resData);
      }
    }
    const resData = customResponse({ code, data: userDetail });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const getAccount = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get Account'
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "firstName": 'Jhon',
            "lastName": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin',
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;
  const authorizationHeaader = req.headers.authorization.split(" ")[1];
  try {
    code = constant.HTTP_200_CODE;
    const user = await userModel
      .findOne({ token: authorizationHeaader })
      .exec();
    const resData = customResponse({ code, data: user });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const validateToken = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get Account'
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "firstName": 'Jhon',
            "lastName": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin',
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */

  let code,
    message,
    data = {};
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
          code = constant.HTTP_401_CODE;
          message = err.message;
          const resData = customResponse({
            code,
            message,
            err,
          });
          return res.status(code).send(resData);
        }
        const user2 = await userModel.findOne({ token: token });
        if (!user2) {
          code = constant.HTTP_401_CODE;
          message = constant.TOKEN_INVALID_MSG;
          const resData = customResponse({
            code,
            message,
          });
          return res.status(code).send(resData);
        }

        result = jwt.verify(token, process.env.JWT_SECRET, options);
        const user = userModel
          .findOne({ email: { $regex: result.email, $options: "i" } })
          .collation({ locale: constant.LOCALE, strength: 2 })
          .exec()
          .then((user) => {
            id = user._id;
            data.name = user.firstName;
            data.email = user.email;
            data.roles = user.role;
            data.permissions = result.permissions;
            data.token = user.token;
            data.id = id.toString();
            code = constant.HTTP_200_CODE;
            message = constant.TOKEN_VALID_MSG;
            const resData = customResponse({ code, message, data });
            return res.status(code).send(resData);
          });
      });
    } catch (error) {
      code = constant.HTTP_401_CODE;
      message = constant.TOKEN_INVALID_MSG;
      const resData = customResponse({
        code,
        message,
        err: error.errors,
      });
      return res.status(code).send(resData);
    }
  } else {
    code = constant.HTTP_401_CODE;
    message = constantAUTHENTICATION_ERR_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

const logout = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get Account'
      #swagger.responses[200] = {
        description: 'User successfully added.',
        schema: {
            "status": "success",
            "code": 200,
            "data": {
              "name": "Rahul",
              "email": "rahul@valuebound.com",
              "roles": [],
              "permissions": [],
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaHVsQHZhbHVlYm91bmQuY29tIiwicGFzc3dvcmQiOiJxd2VydHkxMjMiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2VtcGxveWVlX2Rhc2hib2FyZCIsImVkaXRfZW1wbG95ZWVfZGFzaGJvYXJkIiwiY3JlYXRlX2VtcGxveWVlX2Rhc2hib2FyZCIsImRvd25sb2FkX2VtcGxveWVlX3Byb2ZpbGUiLCJzZWFyY2hfZW1wbG95ZWUiLCJhcHByb3ZlX2VtcGxveWVlX2VkaXRfcmVxdWVzdCIsInZpZXdfQ0lNU19tb2R1bGUiLCJ1cGRhdGVfb25fQ0lNU19tb2R1bGUiLCJjcmVhdGVfQ0lNU19tb2R1bGUiLCJ2aWV3X1BNT19tb2R1bGUiLCJjcmVhdGVfcHJvamVjdF9pbl9QTU8iLCJ1cGRhdGVfcHJvamVjdF9pbl9QTU8iLCJ2aWV3X2JlbmNoX3N0cmVuZ3RoIiwicHJvamVjdF9pbmZvcm1hdGlvbl90YWJsZSIsInZpZXdfQ01TIiwidXBsb2FkX1BPL1NPVy9jb250cmFjdCIsInZpZXdfaW52b2ljZSIsInVwbG9hZF9pbnZvaWNlIiwicmVjaWV2ZV9zbGFja19ub3RpZmljYXRpb24iLCJhd2FyZF9ub21pbmF0aW9uIiwibXlfcmV3YXJkcyIsInJld2FyZHNfaGlzdG9yeSJdLCJyb2xlcyI6WyJzdXBlcl9hZG1pbiJdLCJpYXQiOjE2NDI0NDI3MTYsImV4cCI6MTY0MjYxNTUxNiwiaXNzIjoidmItZXJwIn0.TYQ9FqruI4YviiUtI6ZjowUmh9ZGxsq8TTk1bnQtD5w"
            },
            "message": "Valid Token",
            "error": {}
          },
          "error": {}
        }
      }
  */
  try {
    let code, message;
    await userModel
      .findOneAndUpdate(
        {
          email:
            process.env.NODE_ENV == constant.ENV_TEST
              ? constant.TEST_EMAIL
              : req.decoded.email,
        },
        { $pull: { token: { $exists: true } } },
        { new: true }
      )
      .then(() => {
        code = constant.HTTP_200_CODE;
        message = constant.USER_LOGOUT_MSG;
        const resData = customResponse({ code, message });
        return res.status(code).send(resData);
      });
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({ code, message, error: error.errors });
    res.status(code).send(resData);
  }
};

const setPassword = async (req, res) => {
  let code, message;
  const _id = req.params.id;
  const password = req.body.password;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.USER_UPDATED_SUCCESS_MSG;
    const user = await userModel.findOneAndUpdate(
      { _id },
      { password: password },
      { new: true }
    );
    if (!user) {
      code = constant.HTTP_400_CODE;
      message = constant.BAD_REQ_MSG;
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
    await user.save();
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};
const resetPassword = async (req, res) => {
  let code, message;
  const email = req.query.email;
  try {
    const user = await userModel.find({ email: email });
    if (!user) {
      code = constant.HTTP_400_CODE;
      message = constant.USER_NOT_FOUND_WITH_EMAIL_MSG;
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
    if (user[0].status === constant.STATUS_ACTIVE) {
      const emailBodyContent = generatePasswordResetMessage(
        user[0]._id,
        user[0].firstName
      );
      await sendEmail(
        user[0].email,
        `Oneplace Account:Password Reset`,
        emailBodyContent
      );
      code = constant.HTTP_200_CODE;
      message = constant.EMAIL_RESET_PASSWORD_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = constant.USER_INACTIVE_OR_DELETED_MSG;
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({
      code,
      message,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};
module.exports = {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
  auth,
  getAccount,
  validateToken,
  logout,
  setPassword,
  resetPassword,
  createUserWhileImport,
  updateUserByEmail,
};
