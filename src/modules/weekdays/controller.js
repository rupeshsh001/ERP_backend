const { WeekHoliday } = require("./model");
const constant = require("../../constants/constant");
const { customResponse } = require("../../utility/helper");

const createWeek = async (req, res) => {
  let code, message, data;
  try {
    const week = await WeekHoliday.create(req.body);
    code = constant.HTTP_201_CODE;
    data = week;
    message = constant.WEEK_CREATED_MSG;
    const resData = customResponse({
      code,
      data,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    if (error.name === constant.MONGO_SERVER_ERR && error.code === 11000) {
      code = constant.HTTP_400_CODE;
      message = error.message;
      const resData = customResponse({
        code,
        message,
        err: error.errors,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = error.message;
      const resData = customResponse({
        code,
        message,
        err: error.errors,
      });
      return res.status(code).send(resData);
    }
  }
};

const getAllWeek = async (req, res) => {
  let code, message, data;
  try {
    const Weeks = await WeekHoliday.find();
    code = constant.HTTP_200_CODE;
    message = constant.WEEK_FETCHED_MSG;
    data = Weeks;
    const resData = customResponse({
      code,
      data,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error);
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

const updateWeek = async (req, res) => {
  let code, message, data;
  try {
    const week = await WeekHoliday.findOneAndUpdate(
      { name: req.query.name },
      { $set: { ...req.body } },
      {
        new: true,
      }
    );
    code = constant.HTTP_201_CODE;
    data = week;
    message = constant.WEEK_UPDATED_MSG;
    const resData = customResponse({
      code,
      message,
      data,
    });
    return res.status(code).send(resData);
  } catch (error) {
    if (error.name === constant.MONGO_SERVER_ERR && error.code === 11000) {
      code = constant.HTTP_400_CODE;
      message = error.message;
      const resData = customResponse({
        code,
        message,
        err: error.errors,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = error.message;
      const resData = customResponse({
        code,
        message,
        err: error.errors,
      });
      return res.status(code).send(resData);
    }
  }
};

const deleteWeek = async (req, res) => {
  let code, message, data;
  try {
    const deletedWeek = await WeekHoliday.findOneAndDelete(
      {
        name: req.query.name,
      },
      { rawResult: true }
    );
    code = constant.HTTP_204_CODE;
    data = deletedWeek;
    message = constant.WEEK_DELETED_MSG;
    const resData = customResponse({
      code,
      message,
      data,
    });
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

module.exports = {
  createWeek,
  getAllWeek,
  updateWeek,
  deleteWeek,
};
