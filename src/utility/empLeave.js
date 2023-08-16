const { customResponse, customPagination } = require("../utility/helper");
const { Employee } = require("../models/employeeModel");
const constant = require("../constants/constant");

const createEmpLeave = async (id, leave_type, duration) => {
  try {
    const data = await empLeaveModel.find({
      $and: [
        {
          empId: id,
        },
        {
          leaveType: leave_type,
        },
      ],
    });
    if (data.length != 0) {
      const updatedEmpLeave = await empLeaveModel.findOneAndUpdate(
        {
          $and: [
            {
              orgEmpId: id,
            },
            {
              leaveType: leave_type,
            },
          ],
        },
        { $set: { duration: duration } }
      );
    }
    const empLeave = await new empLeaveModel({
      orgID: id,
      leaveType: leave_type,
      duration: duration,
    });
    empLeave.save();
  } catch (error) {}
};

//getting all the empLeaves
const getEmpLeaves = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let code, message;
  try {
    code = 200;
    message = constant.DATA_FETCH_MSG;
    const empLeaves = await empLeaveModel.find({ ...req.body });
    const data = customPagination({ data: empLeaves, page, limit });
    const resData = customResponse({ code, message, data });
    res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

module.exports = {
  createEmpLeave,
  getEmpLeaves,
};
