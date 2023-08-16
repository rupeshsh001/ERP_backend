const organisationalLeaves = require("./model");
const { Employee } = require("../employee/model");
const { WeekHoliday } = require("../weekdays/model");
const holidayModel = require("../holiday/model");
const leaveTypeModel = require("./model");
const { leavesTypeSchema, leavesTypeUpdateSchema } = require("./schema");
const projectAndEmpModel = require("../allocations/model");
const { customResponse, customPagination } = require("../../utility/helper");
const busboy = require("busboy");
const s3Client = require("../../utility/s3Instance");
const logger = require("../../utility/logger/baseLogger");

const {
  emailContentForLeavesNotification,
} = require("../../utility/emailTemplate/leavesEmailTemplates/leaveStatusUpdate");
const {
  emailContentForEmpAcknowlegement,
} = require("../../utility/emailTemplate/leavesEmailTemplates/employeeAcknowledge");
const {
  emailContentForManagerAcknowlegement,
} = require("../../utility/emailTemplate/leavesEmailTemplates/managerAcknowledge");
const { ObjectId } = require("mongodb");
const { leavesSchema } = require("./schema");
const { sendEmail } = require("../../utility/AutogenerateEmail");
const constant = require("../../constants/constant");

const moment = require("moment");

const capitalize = (words) =>
  words
    .split(" ")
    .map((w) => w.substring(0, 1).toUpperCase() + w.substring(1))
    .join(" ");

const getNumberOfBusinessDays = async (
  start,
  end,
  startDateSession,
  endDateSession
) => {
  const dayNumMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  let RestDaysInNums;
  let leaveHolidayOverlapCount = 0;

  const Weeks = await WeekHoliday.find(
    {},
    {
      weeks: {
        $filter: {
          input: "$weeks",
          as: "weekDay",
          cond: { $eq: ["$$weekDay.holiday", true] },
        },
      },
    }
  );
  if (Weeks[0]?.weeks.length !== 0) {
    RestDaysInNums = Weeks[0]?.weeks.map((weekDay) => {
      return dayNumMap[weekDay.name];
    });
  } else {
    RestDaysInNums = [];
  }

  let toNextTargetDay, daysFromFirstTargetDay;
  let TotalNumOfRestDays = 0;
  let leaveStartDate = new Date(start);
  let leaveEndDate = new Date(end);
  let daysInInterval = Math.ceil(
    Number(
      (leaveEndDate.getTime() - leaveStartDate.getTime()) / (1000 * 3600 * 24)
    ) + 1
  );
  RestDaysInNums.forEach((restDayNum) => {
    toNextTargetDay = (7 + restDayNum - leaveStartDate.getDay()) % 7;
    daysFromFirstTargetDay = Math.max(daysInInterval - toNextTargetDay, 0);
    TotalNumOfRestDays += Math.ceil(daysFromFirstTargetDay / 7);
  });

  let sessionCount = 0;
  if (
    (startDateSession === "s1" && endDateSession === "s1") ||
    (startDateSession === "s2" && endDateSession === "s2")
  ) {
    sessionCount = 0.5;
  } else if (startDateSession === "s2" && endDateSession === "s1") {
    sessionCount = 1;
  }

  const AllGeneralHolidays = await holidayModel.find(
    {
      $and: [
        { type: "general" },
        {
          startDate: {
            $gte: leaveStartDate,
            $lte: leaveEndDate,
          },
        },
      ],
    },
    { startDate: 1, endDate: 1 }
  );
  AllGeneralHolidays.length !== 0 &&
    AllGeneralHolidays.forEach((holiday) => {
      if (
        moment(holiday.startDate).isBetween(
          leaveStartDate,
          leaveEndDate,
          undefined,
          []
        )
      ) {
        leaveHolidayOverlapCount += 1;
      }
    });
  return (
    daysInInterval -
    TotalNumOfRestDays -
    leaveHolidayOverlapCount -
    sessionCount
  );
};

const createLeave = async (req, res) => {
  let code, message, data;
  try {
    const { error } = leavesSchema.validate(req.body);
    if (error) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_REQ_DATA_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }
    if (!req.query.empDocId) {
      code = constant.HTTP_400_CODE;
      message = constant.EMPID_INVALID_REQ_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
    const leaveTypeInfo = await leaveTypeModel.find({
      name: req.body.leaveType,
    });

    const empDoc = await Employee.find(
      { _id: req.query.empDocId },
      {
        name: 1,
        email: 1,
        leaveTaken: {
          $filter: {
            input: "$leaveTaken",
            as: "leaveUsed",
            cond: { $eq: ["$$leaveUsed.type", req.body.leaveType] },
          },
        },
      }
    );
    const totalLeaveDuration = await getNumberOfBusinessDays(
      req.body.startDate,
      req.body.endDate,
      req.body.startDateSession,
      req.body.endDateSession
    );
    const TotalLeaveBalance = leaveTypeInfo[0].quota;
    const UsedLeaveCount =
      empDoc[0].leaveTaken && empDoc[0].leaveTaken.length !== 0
        ? empDoc[0].leaveTaken[0].duration
        : 0;

    const query = { _id: req.query.empDocId };
    const update = {
      $push: { appliedLeaves: { ...req.body } },
    };
    const options = { new: true };

    if (UsedLeaveCount + totalLeaveDuration <= TotalLeaveBalance) {
      const newLeave = await Employee.findOneAndUpdate(query, update, options);
      const managerDoc = await Employee.find(
        { managerId: req.body.applyingTo[0] },
        { email: 1 }
      );
      const ccToName = [...req.body.cc];
      const ccEmailList = (
        await Employee.find(
          {
            email: { $in: ccToName },
          },
          { email: 1 }
        )
      ).map((item) => {
        return item.email;
      });

      const dataForEmpEmailNotification = {
        name: capitalize(empDoc[0].name),
        leave_type: capitalize(req.body.leaveType),
        from_date: new Date(req.body.startDate).toLocaleDateString(),
        to_date: new Date(req.body.endDate).toLocaleDateString(),
        applied_to: capitalize(req.body.applyingTo[0]),
        status: constant.STATUS_SUBMITTED,
        applied_on: new Date().toLocaleDateString(),
      };
      const empContent = await emailContentForEmpAcknowlegement(
        dataForEmpEmailNotification,
        empDoc[0].email
      );
      await sendEmail(empContent.to, empContent.subject, empContent.body);

      const dataForManagerEmailNotification = {
        name: capitalize(empDoc[0].name),
        leave_type: capitalize(req.body.leaveType),
        from_date: new Date(req.body.startDate).toLocaleDateString(),
        to_date: new Date(req.body.endDate).toLocaleDateString(),
        applied_by: capitalize(empDoc[0].name),
        status: constant.STATUS_SUBMITTED,
        applied_on: new Date().toLocaleDateString(),
      };
      const managerContent = await emailContentForManagerAcknowlegement(
        dataForManagerEmailNotification,
        managerDoc[0].email
      );
      await sendEmail(
        managerContent.to,
        managerContent.subject,
        managerContent.body,
        ccEmailList
      );
      code = constant.HTTP_201_CODE;
      data = newLeave;
      message = constant.LEAVE_APPLIED_SUCCESS_MSG;
      const resData = customResponse({ code, message, data });
      return res.status(code).send(resData);
    } else {
      throw new Error(constant.INSUFFICIENT_LEAVES_MSG);
    }
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

const getAllLeaves = async (req, res) => {
  let code, message, data;

  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 15;
    const AllempLeaves = await Employee.find(
      { appliedLeaves: { $exists: true, $type: "array", $ne: [] } },
      { name: 1, appliedLeaves: 1, leaveTaken: 1 }
    );
    code = constant.HTTP_200_CODE;
    message = constant.LEAVES_FETCH_SUCCESS_MSG;
    data = customPagination({ data: AllempLeaves, limit, page });
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

const getLeaveRecords = async (req, res) => {
  let code, message, data;
  const users = req.query.empName || "";
  const startDate = moment(req.query.startDate);
  const endDate = moment(req.query.endDate);
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 15;
    let empList = users.split(',');
    const empLeaves = await Employee.find(
      {
        orgEmpId:{ $in: empList }
      },
      { appliedLeaves: 1 }
    );
    let leaves = empLeaves.map((leaves, index) => leaves.appliedLeaves);
    if (
      req.query.startDate !== "" &&
      req.query.endDate !== "" &&
      req.query.startDate !== undefined &&
      req.query.endDate !== undefined
    ) {
      leaves = leaves.map((data, i) =>data.filter(
        (leave) =>
          startDate.isSameOrBefore(moment(leave.startDate)) &&
          endDate.isSameOrAfter(moment(leave.endDate))
      ));
    }
    code = constant.HTTP_200_CODE;
    message = constant.LEAVE_RECORD_FETCH_SUCCESS_MSG;
    if (req.query.download === "true") {
      data = leaves;
    } else {
      data = customPagination({ data: leaves, limit, page });
    }
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (err) {
    logger.error(error);
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: err,
    });
    return res.status(code).send(resData);
  }
};
const updateLeaveStatus = async (req, res) => {
  let code, message;
  try {
    const id = req.query.id;
    const status = req.body.status;

    let updateLeave = await Employee.findOneAndUpdate(
      { "appliedLeaves._id": id },
      {
        $set: {
          "appliedLeaves.$.status": status,
          "appliedLeaves.$.comments": req.body.comments || "okay",
          "appliedLeaves.$.reviewedAt": new Date(),
          "appliedLeaves.$.reviewedBy": req.body.reviewedBy || "",
        },
      }
    );
    if (status === constant.STATUS_WITHDRAW_PENDING) {
      updateLeave = await Employee.findOneAndUpdate(
        { "appliedLeaves._id": id },
        {
          $push: { "appliedLeaves.$.applyingTo": req.body.hr },
        }
      );
    }
    const updatedLeaveData = await Employee.find(
      { "appliedLeaves._id": id },
      {
        appliedLeaves: {
          $filter: {
            input: "$appliedLeaves",
            as: "leave",
            cond: { $eq: ["$$leave._id", ObjectId(id)] },
          },
        },

        _id: 1,
        email: 1,
        name: 1,
      }
    );
    const start_date = new Date(updatedLeaveData[0].appliedLeaves[0].startDate);
    const end_date = new Date(updatedLeaveData[0].appliedLeaves[0].endDate);
    const startDateSession =
      updatedLeaveData[0].appliedLeaves[0].startDateSession;
    const endDateSession = updatedLeaveData[0].appliedLeaves[0].endDateSession;

    const totalLeaveDuration = await getNumberOfBusinessDays(
      start_date,
      end_date,
      startDateSession,
      endDateSession
    );
    const leave_type = updatedLeaveData[0].appliedLeaves[0].leave_type;
    const empId = updatedLeaveData[0]._id;

    if (
      status === constant.STATUS_APPROVED ||
      status === constant.STATUS_REJECTED ||
      status === constant.STATUS_WITHDRAW_APPROVE ||
      status === constant.STATUS_WITHDRAW_REJECT ||
      status === constant.STATUS_WITHDRAW_PENDING
    ) {
      const dataForEmailNotification = {
        name: capitalize(updatedLeaveData[0].name),
        status: capitalize(updatedLeaveData[0].appliedLeaves[0].status),
        leave_type: capitalize(updatedLeaveData[0].appliedLeaves[0].leaveType),
        from_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].startDate
        ).toLocaleDateString(),
        to_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].endDate
        ).toLocaleDateString(),
        duration: totalLeaveDuration,
        reviewed_by: capitalize(
          updatedLeaveData[0].appliedLeaves[0].reviewedBy
        ),
        comment: updatedLeaveData[0].appliedLeaves[0].comments,
        applied_on: new Date(
          updatedLeaveData[0].appliedLeaves[0].createdAt
        ).toLocaleDateString(),
      };
      const content = await emailContentForLeavesNotification(
        dataForEmailNotification,
        updatedLeaveData[0].email
      );

      const managerDoc = await Employee.find(
        { orgEmpId: req.body.hr },
        { email: 1 }
      );

      const dataForManagerEmailNotification = {
        name: capitalize(updatedLeaveData[0].name),
        leave_type: capitalize(updatedLeaveData[0].appliedLeaves[0].leaveType),
        from_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].startDate
        ).toLocaleDateString(),
        to_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].endDate
        ).toLocaleDateString(),
        applied_by: capitalize(updatedLeaveData[0].name),
        status: constant.STATUS_WITHDRAW_PENDING,
        applied_on: new Date().toLocaleDateString(),
      };

      const dataForEmpEmailNotification = {
        name: capitalize(updatedLeaveData[0].name),
        leave_type: capitalize(updatedLeaveData[0].appliedLeaves[0].leaveType),
        from_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].startDate
        ).toLocaleDateString(),
        to_date: new Date(
          updatedLeaveData[0].appliedLeaves[0].endDate
        ).toLocaleDateString(),
        applied_to: capitalize(
          updatedLeaveData[0].appliedLeaves[0].applyingTo[0]
        ),
        status: constant.STATUS_SUBMITTED,
        applied_on: new Date().toLocaleDateString(),
      };
      const empContent = await emailContentForEmpAcknowlegement(
        dataForEmpEmailNotification,
        updatedLeaveData[0].email
      );

      if (status === constant.STATUS_WITHDRAW_APPROVE) {
        await sendEmail(content.to, "Withdrawl Request Approved", content.body);
      } else if (status === constant.STATUS_WITHDRAW_REJECT) {
        await sendEmail(content.to, "Withdrawl Request Rejected", content.body);
      } else if (status === constant.STATUS_WITHDRAW_PENDING) {
        const managerContent = await emailContentForManagerAcknowlegement(
          dataForManagerEmailNotification,
          managerDoc[0].email
        );
        await sendEmail(
          managerContent.to,
          "Received withdrawal requested",
          managerContent.body
        );
        await sendEmail(
          empContent.to,
          "Your withdrawal requested has been submitted",
          empContent.body
        );
      } else if (
        status === constant.STATUS_APPROVED ||
        status === constant.STATUS_REJECTED
      ) {
        await sendEmail(content.to, content.subject, content.body);
      }
    }
    if (status === constant.STATUS_APPROVED) {
      updateLeaveCount(empId, leave_type, totalLeaveDuration);
    } else if (status === constant.STATUS_WITHDRAW_APPROVE) {
      withdrawLeaveAct(empId, leave_type, totalLeaveDuration);
    }
    code = constant.HTTP_200_CODE;
    message = constant.STATUS_CHANGE_SUCCESS_MSG;
    const resData = customResponse({ code, message });
    res.status(code).send(resData);
  } catch (error) {
    logger.error(error);
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.message,
    });
    res.status(code).send(resData);
  }
};

const getAllEmpLeavesByProject = async (req, res) => {
  if (!req.query.projectId) {
    code = constant.HTTP_400_CODE;
    message = constant.PROJ_ID_INVALID_REQ_MSG;
    const resData = customResponse({
      code,
      message,
    });
    return res.status(code).send(resData);
  }
  try {
    let code, message, data;
    const page = req.query.page || 1;
    const limit = req.query.limit || 15;
    const projectId = req.query.projectId;
    const allocatedEmps = (
      await projectAndEmpModel.find({ projectId: projectId }, { empId: 1 })
    ).map(({ empId }) => empId);
    const empsOnLeave = await Employee.find(
      {
        _id: { $in: allocatedEmps },
      },
      { name: 1, appliedLeaves: 1 }
    );

    data = customPagination({ data: empsOnLeave, limit, page });
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

//calculating no. of leaves taken by an emp
const updateLeaveCount = async (empId, leave_type, duration) => {
  try {
    const leaveTakenData = await Employee.find(
      {
        _id: empId,
      },
      {
        leaveTaken: {
          $filter: {
            input: "$leaveTaken",
            as: "leaveUsed",
            cond: { $eq: ["$$leaveUsed.type", leave_type] },
          },
        },
      }
    );

    if (
      leaveTakenData[0].leaveTaken === null ||
      leaveTakenData[0].leaveTaken.length == 0 ||
      leaveTakenData[0].leaveTaken[0].type != leave_type
    ) {
      const query = { _id: empId };
      const doc = {
        type: leave_type,
        duration: duration,
      };
      const update = {
        $push: {
          leaveTaken: {
            ...doc,
          },
        },
      };
      const options = { new: true };
      const createLeaveTaken = await Employee.findOneAndUpdate(
        query,
        update,
        options
      );
    } else {
      const updatedDuration =
        Number(leaveTakenData[0].leaveTaken[0].duration) + Number(duration);
      const updatedEmpLeave = await Employee.findOneAndUpdate(
        {
          _id: empId,
          "leaveTaken.type": leave_type,
        },
        { $set: { "leaveTaken.$.duration": updatedDuration } }
      );
    }
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

//Action when leave is withdrawn
const withdrawLeaveAct = async (empId, leave_type, duration) => {
  try {
    const fetchTakenLeave = await Employee.find(
      {
        _id: empId,
        "leaveTaken.type": leave_type,
      },
      {
        leaveTaken: {
          $filter: {
            input: "$leaveTaken",
            as: "leaveUsed",
            cond: { $eq: ["$$leaveUsed.type", leave_type] },
          },
        },
      }
    );

    const updatedDuration =
      Number(fetchTakenLeave[0].leaveTaken[0].duration) - Number(duration);

    const updatedEmpLeave = await Employee.findOneAndUpdate(
      {
        _id: empId,
        "leaveTaken.type": leave_type,
      },
      { $set: { "leaveTaken.$.duration": updatedDuration } }
    );
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

//calculating no. of leaves left for an emp.
const empLeftLeaves = async (leaveTaken) => {
  let left, doc;
  const TotalLeave = await organisationalLeaves.find({});
  let empLeftLeaves = [];
  leaveTaken.forEach((empLeave) => {
    TotalLeave.forEach((orgLeaves) => {
      if (empLeave.type == orgLeaves.name) {
        left = Number(orgLeaves.quota) - Number(empLeave.duration);
        doc = { name: orgLeaves.quota, left: left };
        empLeftLeaves.push(...doc);
      }
    });
  });
  return empLeftLeaves;
};

const getLeaveForApproval = async (req, res) => {
  let code, message, data, totalPage;
  try {
    const managerId = req.query.manager;
    const leaveStatus = req.query.status;
    const employeeName = req.query.empName;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 15;
    const skip = (page - 1) * limit;

    const leaveAppliedPipeline = [
      {
        //break array of appliedLeaves field
        $unwind: { path: "$appliedLeaves" },
      },
      {
        //match for reporting manager
        $match: {
          "appliedLeaves.applying_to": {
            $in: [managerId, "$$appliedLeaves.applying_to"],
          },
        },
      },
      {
        //projection of the fiedls
        $project: {
          name: 1,
          appliedLeaves: 1,
        },
      },
      {
        //sort
        $sort: { "appliedLeaves.createdAt": -1 },
      },
      {
        //pagination
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    //add query according to the query recieved
    //NOTE:query position or index is very important make sure it is after match query if its a match one!
    if (leaveStatus)
      leaveAppliedPipeline.splice(2, 0, {
        //query for status field
        $match: {
          "appliedLeaves.status": leaveStatus,
        },
      });

    if (employeeName)
      leaveAppliedPipeline.splice(2, 0, {
        //query for empName field
        $match: {
          name: employeeName,
        },
      });

    //execute the query
    const result = await Employee.aggregate(leaveAppliedPipeline);
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    data = result[0]?.data || [];
    totalPage = Math.ceil(result[0]?.metadata[0]?.total / limit || 1);
    const resdata = customResponse({
      code,
      data,
      message,
      totalPage,
    });
    return res.status(code).send(resdata);
  } catch (error) {
    logger.error(error);
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    res.status(code).send(resData);
  }
};
const getUserAppliedLeaves = async (req, res) => {
  let code, message, data;
  try {
    const leaveStatus = req.query.status;
    const employeeId = req.query.empDocId;
    const year = req.query.year;
    const month = req.query.month;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 15;
    const skip = (page - 1) * limit;
    if (!employeeId) {
      throw new Error("Employee Id(objectId) is required");
    }

    const leaveAppliedPipeline = [
      {
        $unwind: { path: "$appliedLeaves" },
      },
      {
        $match: {
          _id: ObjectId(employeeId),
        },
      },
      {
        $project: {
          name: 1,
          appliedLeaves: 1,
          year: { $year: "$appliedLeaves.startDate" },
          month: { $month: "$appliedLeaves.startDate" },
        },
      },
      {
        $sort: { "appliedLeaves.createdAt": -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    if (year) {
      leaveAppliedPipeline.splice(3, 0, {
        $match: {
          year: Number(year),
        },
      });
    }
    if (month) {
      leaveAppliedPipeline.splice(3, 0, {
        $match: {
          month: Number(month),
        },
      });
    }
    if (leaveStatus) {
      leaveAppliedPipeline.splice(3, 0, {
        $match: {
          "appliedLeaves.status": leaveStatus,
        },
      });
    }

    const result = await Employee.aggregate(leaveAppliedPipeline);
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;

    res.status(code).json({
      status: constant.STATUS_SUCCESS,
      code,
      message,
      page,
      limit,
      totalPage: Math.ceil(result[0]?.metadata[0]?.total / limit || 1),
      count: result[0]?.metadata[0]?.total,
      data: result[0]?.data || [],
    });
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    res.status(code).send(resData);
  }
};

const uploadDoc = (req, res) => {
  let chunks = [];
  let fName, fEncoding, fMimeType;
  const folder = "leaves/";

  const bb = busboy({ headers: req.headers });

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    fName = folder + filename;
    fEncoding = encoding;
    fMimeType = mimeType;
    file.on("data", (data) => {
      chunks.push(data);
    });
  });
  bb.on("finish", async () => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fName,
      Body: Buffer.concat(chunks),
      ContentEncoding: fEncoding,
      ContentType: fMimeType,
    };
    try {
      const s3res = await s3Client.upload(params).promise();
      res.send({
        status: constant.STATUS_SUCCESS,
        msg: constant.FILE_UPLOAD_SUCCESS_MSG,
        data: s3res,
      });
    } catch (error) {
      logger.error(error);
      let code = constant.HTTP_404_CODE;
      let message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
  });
  req.pipe(bb);
};

const downloadDoc = (req, res) => {
  let code, message;
  const folder = "leaves/";
  const fileName = req.params.fileName;
  const fName = folder + fileName;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fName,
  };

  s3Client.getObject(params, (err, data) => {
    if (err) {
      code = constant.HTTP_404_CODE;
      message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: err,
      });
      return res.status(code).send(resData);
    } else {
      res.attachment(fileName);
      s3Client.getObject(params).createReadStream().pipe(res);
    }
  });
};

const createLeaveType = async (req, res) => {
  let code, message;
  const { error } = leavesTypeSchema.validate(req.body);
  if (error) {
    code = constant.HTTP_400_CODE;
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
    const LeaveType = await leaveTypeModel.create(req.body);
    const resdata = customResponse({ code, data: LeaveType });
    return res.status(code).send(resdata);
  } catch (error) {
    if (error.name === constant.MONGO_SERVER_ERR && error.code === 11000) {
      code = constant.HTTP_400_CODE;
      message = constant.TYPE_EXIST_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = constant.SOMETHING_WRONG_MSG;
      const resData = customResponse({
        code,
        message,
        err: error.message,
      });
      return res.status(code).send(resData);
    }
  }
};

//getting all the projects
const getLeaveTypes = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 100;
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    const allLeaveTypes = await leaveTypeModel.find({ ...req.body });
    const data = customPagination({ data: allLeaveTypes, page, limit });
    const resData = customResponse({ code, message, data });
    return res.status(200).send(resData);
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

const updateLeaveTypes = async (req, res) => {
  let code, message;
  const { error } = leavesTypeUpdateSchema.validate(req.body);
  if (error) {
    code = constant.HTTP_400_CODE;
    message = constant.INVALID_REQ_DATA_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
  try {
    const id = req.query.id;
    const UpdatedLeaveTypes = await leaveTypeModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      {
        new: true,
      }
    );
    code = constant.HTTP_200_CODE;
    const resdata = customResponse({ code, data: UpdatedLeaveTypes });
    return res.status(code).send(resdata);
  } catch (error) {
    if (error.name === constant.MONGO_SERVER_ERR && error.code === 11000) {
      code = constant.HTTP_400_CODE;
      message = constant.TYPE_EXIST_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = constant.SOMETHING_WRONG_MSG;
      const resData = customResponse({
        code,
        message,
        err: error.message,
      });
      return res.status(code).send(resData);
    }
  }
};

const deleteLeaveType = async (req, res) => {
  let code, message;
  try {
    const id = req.query.id;
    const deletedLeaveType = await leaveTypeModel.findByIdAndDelete(id);
    code = constant.HTTP_200_CODE;
    message = deletedLeaveType
      ? constant.TYPE_DEL_SUCCESS_MSG
      : constant.TYPE_NOT_FOUND_MSG;
    const resdata = customResponse({ code, data: deletedLeaveType, message });
    return res.status(code).send(resdata);
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

module.exports = {
  createLeave,
  getAllLeaves,
  updateLeaveStatus,
  getAllEmpLeavesByProject,
  getLeaveForApproval,
  getUserAppliedLeaves,
  uploadDoc,
  downloadDoc,
  getLeaveRecords,
  createLeaveType,
  getLeaveTypes,
  updateLeaveTypes,
  deleteLeaveType,
};
