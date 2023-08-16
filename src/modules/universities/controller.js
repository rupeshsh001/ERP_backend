const mongoose = require("mongoose");
const { universityModel } = require("./model");
const { customResponse, customPagination } = require("../../utility/helper");
const constant = require("../../constants/constant");

const getAllUniversities = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const data = await universityModel.find({});
    const resData = customPagination({ data, page, limit });
    res.send(resData);
  } catch (err) {
    code = constant.HTTP_400_CODE;
    message = err.message;
    const resData = customResponse({
      code,
      message,
      err: err.errors,
    });
    return res.status(code).send(resData);
  }
};

const searchUniversity = async (req, res) => {
  try {
    const query = "^" + req.query.name;
    const page = req.query.page;
    const limit = req.query.limit;

    const data = await universityModel.find({
      university: { $regex: query, $options: "i" },
    });
    let code = constant.HTTP_200_CODE;
    let message = constant.SUCESS_MSG;
    let totalResult = data.length;
    if (totalResult === 0) {
      return res.status(constant.HTTP_200_CODE).json({
        status: constant.STATUS_SUCCESS,
        totalResult,
        data: [{ university: "others" }],
      });
    }
    const resData = customResponse({
      code,
      message,
      data,
      totalResult,
    });
    return res.status(code).send(resData);
  } catch (err) {
    code = constant.HTTP_400_CODE;
    message = err.message;
    const resData = customResponse({
      code,
      message,
      err: err.errors,
    });
    return res.status(code).send(resData);
  }
};

module.exports = { getAllUniversities, searchUniversity };
