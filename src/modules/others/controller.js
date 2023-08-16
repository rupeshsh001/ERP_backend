const countries = require("country-state-picker");
const fetch = require("node-fetch");
const { locationSchema } = require("../clients/schema");
const { customResponse } = require("../../utility/helper");
const jwt = require("jsonwebtoken");
const { custom } = require("joi");
const compModal = require("../clients/model");
const { Employee } = require("../employee/model");
const APIFeatures = require("../../utility/apiFeatures");
const moment = require("moment");
const constant = require("../../constants/constant");

const TOKEN_SECRET =
  "6850cc6ab29180f03f647c9b7ff331298038b2cd9bf71980f87bfd547e0da37ac60c4c5d7f7136f81b81496a741f496ea3e528b70755bcf020874e0ef01446db";

//Token creation
const postLogin = (req, res) => {
  const username = req.body.username;
  var user = { name: username };

  if (username == null) user = { name: constant.DUMMY_USERNAME };

  const token = jwt.sign(user, TOKEN_SECRET, {
    expiresIn: constant.TOKEN_EXPIRES_IN,
  });
  res.json({ Token: token });
};

//Get location from pincode and country
const getLocation = async (req, res) => {
  const pincode = req.headers.pincode;
  const country = req.headers.country;
  const { error } = locationSchema.validate(req.headers);

  if (error) {
    code = constant.HTTP_400_CODE;
    message = constant.INVALID_REQ_DATA_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.send(resData);
  }

  const url = `${process.env.WORLDPOSTALALLOCATION}?postalcode=${pincode}&countrycode=${country}`;
  const fetch_res = await fetch(url);

  const location = await fetch_res.json();

  try {
    const state = location.result[0].state;
    const districts = location.result.reduce(function (res, curr) {
      res[curr.district] = res[curr.district] || [];
      res[curr.district].push(curr.postalLocation);
      return res;
    }, {});

    const locs = new Object({
      state,
      districts,
    });

    (code = constant.HTTP_200_CODE),
      (data = locs),
      (message = constant.DATA_FETCH_MSG);
    const resData = customResponse({
      code,
      data,
      message,
      code,
    });
    res.send(resData);
  } catch (err) {
    code = constant.HTTP_400_CODE;
    message = constant.PINCODE_NOT_EXIST_MSG;
    const resData = customResponse({
      code,
      message,
      err: [
        {
          message,
        },
      ],
    });
    return res.status(code).send(resData);
  }
};

//Get all countries for dropdown
const getCountriesList = async (req, res) => {
  const countriesList = countries.getCountries();

  code = constant.HTTP_200_CODE;
  data = countriesList;
  message = constant.DATA_FETCH_MSG;
  const resData = customResponse({
    code,
    data,
    message,
  });
  return res.status(code).send(resData);
};

//Get client info with some id
const getClientInfo = async (req, res) => {
  try {
    const clientId = req.headers["id"];
    const Comps = await compModal.find({ _id: clientId });

    code = constant.HTTP_200_CODE;
    data = Comps;
    message = constant.DATA_FETCH_MSG;
    const resData = customResponse({
      code,
      data,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.NO_RECORD_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
      err: [
        {
          message,
        },
      ],
    });
    return res.status(code).send(resData);
  }
};

//Check if record with same brandname already exists
const duplicates = async (req, res) => {
  var brandname = req.headers.brandname.replace(/\s+/g, " ").trim();
  var id = req.headers.id;
  try {
    if (!id) {
      compModal.findOne(
        { brandName: { $regex: new RegExp(`^${brandname}$`, "i") } },
        function (err, example) {
          if (err) {
            code = constant.HTTP_400_CODE;
            const resData = customResponse({
              code,
              message,
              err: err && err.details,
            });
            return res.status(code).send(resData);
          }
          if (example) {
            code = constant.HTTP_400_CODE;
            message = constant.DATA_WITH_BRAND_EXIST_MSG;
            const resData = customResponse({
              code,
              message,
              err: [
                {
                  message,
                },
              ],
            });
            return res.status(code).send(resData);
          } else {
            code = constant.HTTP_200_CODE;
            message = constant.DATA_UNIQUE_MSG;
            const resData = customResponse({
              code,
              message,
              err,
            });
            return res.status(code).send(resData);
          }
        }
      );
    } else {
      const record1 = await compModal.find({ _id: id });
      const record2 = await compModal.find({
        brandName: new RegExp(`^${brandname}$`, "i"),
      });

      if (
        typeof record2[0] === "undefined" ||
        record1[0]._id.equals(record2[0]._id)
      ) {
        code = constant.HTTP_200_CODE;
        message = constant.DATA_UNIQUE_MSG;
        const resData = customResponse({
          code,
          message,
        });
        res.status(code).send(resData);
      } else {
        code = constant.HTTP_400_CODE;
        message = constant.DATA_WITH_BRAND_EXIST_MSG;
        const resData = customResponse({
          code,
          message,
          err: [
            {
              message,
            },
          ],
        });
        return res.status(code).send(resData);
      }
    }
  } catch (err) {
    code = constant.HTTP_400_CODE;
    const resData = customResponse({
      code,
      err: err && err.details,
    });
    return res.status(code).send(resData);
  }
};

const checkLegalName = async (req, res) => {
  var legalname = req.headers.legalname.replace(/\s+/g, " ").trim();
  var id = req.headers.id;
  try {
    if (!id) {
      compModal.findOne(
        { legalName: { $regex: new RegExp(`^${legalname}$`, "i") } },
        function (err, example) {
          if (err) {
            code = constant.HTTP_400_CODE;
            const resData = customResponse({
              code,
              message,
              err: err && err.details,
            });
            return res.status(code).send(resData);
          }
          if (example) {
            code = constant.HTTP_400_CODE;
            message = constant.DATA_WITH_LEGAL_NAME_MSG;
            const resData = customResponse({
              code,
              message,
              err: [
                {
                  message,
                },
              ],
            });
            return res.status(code).send(resData);
          } else {
            code = constant.HTTP_200_CODE;
            message = constant.DATA_UNIQUE_MSG;
            const resData = customResponse({
              code,
              message,
              err,
            });
            return res.status(code).send(resData);
          }
        }
      );
    } else {
      const record1 = await compModal.find({ _id: id });
      const record2 = await compModal.find({
        legalName: new RegExp(`^${legalname}$`, "i"),
      });

      if (
        typeof record2[0] === "undefined" ||
        record1[0]._id.equals(record2[0]._id)
      ) {
        code = constant.HTTP_200_CODE;
        message = constant.DATA_UNIQUE_MSG;
        const resData = customResponse({
          code,
          message,
        });
        return res.status(code).send(resData);
      } else {
        code = constant.HTTP_400_CODE;
        message = constant.DATA_WITH_LEGAL_NAME_MSG;
        const resData = customResponse({
          code,
          message,
          err: [
            {
              message,
            },
          ],
        });
        return res.status(code).send(resData);
      }
    }
  } catch (err) {
    code = constant.HTTP_400_CODE;
    const resData = customResponse({
      code,
      err: err && err.details,
    });
    return res.status(code).send(resData);
  }
};

const getReport = async (req, res) => {
  //hit this using, for ref URL/report?page=1&limit=10&search=&sort=&onbench=
  try {
    let sort = {};
    if (req.query.sort?.length && req.query.sort[0] === "-") {
      sort[req.query.sort?.slice(1)] = -1;
    } else if (req.query.sort?.length) {
      sort[req.query.sort] = 1;
    } else {
      sort["orgEmpId"] = 1;
    }
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    let onBenchFilterByMonth = req.query.filterByMonth;
    const reportPipeline = [
      {
        $match: {
          status: constant.STATUS_ACTIVE,
        },
      },
      {
        $lookup: {
          from: "allocations",
          localField: "_id",
          foreignField: "empId",
          as: "employeeProject",
        },
      },
      {
        $unwind: {
          path: "$employeeProject",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "projectschemas",
          localField: "employeeProject.projectId",
          foreignField: "_id",
          as: "employeeProject.projectDetail",
        },
      },
      {
        $unwind: {
          path: "$employeeProject.projectDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        //grouping
        $group: {
          _id: "$_id",
          orgEmpId: { $first: "$orgEmpId" },
          name: { $first: "$name" },
          email: { $first: "$email" },
          managerId: { $first: "$managerId" },
          designation: { $first: "$designation" },
          skillSet: { $first: "$skillSet" },
          allocationWithDate: {
            $push: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        "$employeeProject.endDate",
                        moment()
                          .subtract(onBenchFilterByMonth * 1, "months")
                          .utcOffset("+05:30")
                          .format(),
                      ],
                    },
                  ],
                },
                {
                  projectName: "$employeeProject.projectDetail.projectName",
                  startDate: "$employeeProject.startDate",
                  endDate: "$employeeProject.endDate",
                  allocation: "$employeeProject.percentage",
                },
                "$$REMOVE",
              ],
            },
          },
          employeeProject: { $push: "$employeeProject" },
          totalActiveAllocation: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        "$employeeProject.endDate",
                        moment().utcOffset("+05:30").format(),
                      ],
                    },
                  ],
                },
                "$employeeProject.percentage",
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          onBench: {
            $cond: [{ $eq: [[], "$allocationWithDate"] }, "true", "false"],
          },
          activeAllocation: {
            $cond: [{ $ne: [[], "$allocationWithDate"] }, "true", "false"],
          },
        },
      },
      {
        $match: {
          $or: [
            {
              activeAllocation: {
                $regex: req.query.allocated || "",
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $match: {
          $or: [
            { onBench: { $regex: req.query.onbench || "", $options: "i" } },
          ],
        },
      },
      {
        //sort
        $sort: sort,
      },
      {
        //search
        $match: {
          $or: [
            { orgEmpId: { $regex: req.query.search || "", $options: "i" } },
            { name: { $regex: req.query.search || "", $options: "i" } },
            { email: { $regex: req.query.search || "", $options: "i" } },
            {
              managerId: {
                $regex: req.query.search || "",
                $options: "i",
              },
            },
            {
              designation: { $regex: req.query.search || "", $options: "i" },
            },
            {
              "skillSet.skillName": {
                $regex: req.query.search || "",
                $options: "i",
              },
            },
            {
              "employeeProject.projectDetail.projectName": {
                $regex: req.query.search || "",
                $options: "i",
              },
            },
          ],
        },
      },
      {
        //pagination
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const data = await Employee.aggregate(reportPipeline);
    let code = constant.HTTP_200_CODE;
    let message = constant.SUCESS_MSG;
    const resdata = customResponse({
      code,
      totalResult: data[0].data.length,
      totalCount: data[0].metadata[0]?.total || 0,
      data: data[0].data,
      message,
      error: {},
    });
    return res.status(code).send(resdata);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      data: [],
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

module.exports = {
  duplicates,
  postLogin,
  getLocation,
  getCountriesList,
  getClientInfo,
  checkLegalName,
  getReport,
};
