const holidayModel = require("./model");
const { customResponse, customPagination } = require("../../utility/helper");
const constant = require("../../constants/constant");

const createHoliday = async (req, res) => {
  let code, message;
  try {
    const holiday = await new holidayModel(req.body);
    holiday.save();
    code = constant.HTTP_201_CODE;
    message = constant.HOLIDAY_CREATE_SUCCESS_MSG;
    const data = holiday;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

const getAllHolidays = async (req, res) => {
  let code, message;
  try {
    const year = req.query.year;
    code = constant.HTTP_200_CODE;
    const limit = 100;
    message = constant.DATA_FETCH_MSG;
    const holidays = await holidayModel
      .aggregate([
        {
          $project: {
            name: 1,
            startDate: 1,
            endDate: 1,
            type: 1,
            status: 1,
            year: { $year: "$startDate" },
          },
        },
        { $match: { year: Number(year) } },
      ])
      .sort({ startDate: 1 });
    const data = customPagination({ data: holidays, limit });
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getHolidayByType = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 100;
  let code, message;
  try {
    const type = req.params.type;
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    const holiday = await holidayModel.find({ type: type });
    const data = customPagination({ data: holiday, page, limit });
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateHoliday = async (req, res) => {
  let code, message;
  try {
    const id = req.params.id;
    const updatedHoliday = await holidayModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    code = constant.HTTP_200_CODE;
    message = constant.DATA_UPDATE_SUCCESS_MSG;
    const data = updatedHoliday;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

const deleteHoliday = async (req, res) => {
  let code;
  try {
    code = constant.HTTP_200_CODE
    const id = req.query.id;
    const deletedHoliday = await holidayModel.findByIdAndDelete(id);
    const resdata = customResponse({ code, data: deletedHoliday });
    return res.status(code).send(resdata);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const handleMultipleHolidayStatus = async (req, res) => {
  const status = req.query.status;
  if (status === "enable") {
    await enableMultipleHoliday(req, res);
  } else if (status === "disable") {
    await disableMultipleHoliday(req, res);
  } else {
    code = constant.HTTP_400_CODE;
    message = constant.BAD_REQ_MSG;
    const resData = customResponse({
      code,
      message,
    });
    return res.status(code).send(resData);
  }
};

const disableMultipleHoliday = async (req, res) => {
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    const disableHoliday = await holidayModel.updateMany(
      { _id: { $in: req.body.disabledDocument } },
      { $set: { status: constant.STATUS_INACTIVE } }
    );
    message = constant.HOLIDAY_DISABLE_SUCCESS_MSG;
    const data = customResponse({ data: disableHoliday, code, message });
    return res.status(code).json(data);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const data = customResponse({ code, message, err: error.message });
    return res.status(code).json(data);
  }
};

const enableMultipleHoliday = async (req, res) => {
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    const enableHoliday = await holidayModel.updateMany(
      { _id: { $in: req.body.enabledDocument } },
      { $set: { status: "Active" } }
    );
    message = constant.HOLIDAY_ENABLE_SUCCESS_MSG;
    const data = customResponse({ data: enableHoliday, code, message });
    return res.status(code).json(data);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const data = customResponse({ code, message, err: error.message });
    return res.status(code).json(data);
  }
};

module.exports = {
  createHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday,
  getHolidayByType,
  disableMultipleHoliday,
  enableMultipleHoliday,
  handleMultipleHolidayStatus,
};
