const { json } = require("body-parser");
const allocationModel = require("./model");
const { Employee } = require("../employee/model");
const constant = require("../../constants/constant");
const {
  getAllocationQuery,
  getAllocationsFilteredData,
  getOnBenchFilteredData,
  getTotalAllocationCalculated,
} = require("../../utility/pmoUtils");
//JOI
const { allocationSchema } = require("./schema");
const { customResponse, customPagination } = require("../../utility/helper");
const _ = require("lodash");
const moment = require("moment");

// Create request
const createAllocations = async (req, res) => {
  let code, message, resData;
  try {
    let allocation;
    const { projectId, resources } = req.body;
    const resourcesToInsert = resources.map((eachResource) => ({
      ...eachResource,
      projectId,
    }));
    allocation = await allocationModel.insertMany(resourcesToInsert);
    code = constant.HTTP_201_CODE;
    message = constant.CREATE_ALLOCATION_SUCCESS;
    resData = customResponse({ code, message, data: allocation });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

const updateAllocation = async (req, res) => {
  let code, message;
  try {
    let allocation;
    const { projectId, resources } = req.body;
    const newResources = resources.filter((eachResource) => !eachResource._id);
    const resourcesToInsert = newResources.map((eachResource) => ({
      ...eachResource,
      projectId,
    }));
    allocation = await allocationModel.insertMany(resourcesToInsert);
    code = constant.HTTP_201_CODE;
    message = constant.UPDATE_ALLOCATION_SUCCESS;
    const resData = customResponse({ code, message, data: allocation });

    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};
const updateResData = async (req, res) => {
  let code, message;
  try {
    const _id = req.params.id;
    const data = await allocationModel.findByIdAndUpdate(_id, {
      endDate: req.body.endDate,
      percentage: req.body.percentage,
      rackRate: req.body.rackRate,
      role: req.body.role,
    });
    data.save();
    code = constant.HTTP_200_CODE;
    message = constant.RESOURCE_UPDATE_SUCCESS;
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

// Delete Request
const deleteAllocation = async (req, res) => {
  let code, message, resData;
  try {
    const deleteResource = await allocationModel.findByIdAndDelete(
      req.params.id
    );
    code = constant.HTTP_204_CODE;
    message = constant.DELETE_RESOURCE_SUCCESS;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

// Get allocations
const getAllocations = async (req, res) => {
  const query = getAllocationQuery(req.query);
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.GET_ALLOCATION_SUCCESS;
    const projectDetails = await allocationModel
      .find({})
      .populate("empId", "_id orgEmpId name")
      .populate(
        "projectId",
        "_id vbProjectId startDate endDate vbProjectStatus projectName"
      );
    const filteredData = getAllocationsFilteredData(query, projectDetails);
    const data = customPagination({ data: filteredData, page, limit });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
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

// Get Sorted allocations
const getSortedAllocations = async (req, res) => {
  const fieldName = req.query.sort;
  const query = getAllocationQuery(req.query);
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.GET_ALLOCATION_SUCCESS;
    const projectDetails = await allocationModel
      .find({})
      .populate("empId", "_id orgEmpId name")
      .populate(
        "projectId",
        "_id vbProjectId startDate endDate vbProjectStatus projectName"
      )
      .sort(fieldName);

    const filteredData = getAllocationsFilteredData(query, projectDetails);
    const data = customPagination({ data: filteredData, page, limit });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
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

//GET on Bench
const getAllocationsOnBench = async (req, res) => {
  const query = getAllocationQuery(req.query);
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.GET_ALLOCATION_BENCH_SUCCESS;
    const projectDetails = await allocationModel
      .find({})
      .populate(
        "empId",
        "_id orgEmpId name primaryCapability designation skillSet yearsOfExperience"
      )
      .populate(
        "projectId",
        "_id vbProjectId startDate endDate vbProjectStatus projectName"
      );
    const employeesData = await Employee.find(
      { status: constant.STATUS_ACTIVE },
      {
        orgEmpId: 1,
        name: 1,
        primaryCapability: 1,
        designation: 1,
        skillSet: 1,
        yearsOfExperience: 1,
      }
    );

    const filteredData = getOnBenchFilteredData(
      query,
      projectDetails,
      employeesData
    );
    const data = customPagination({ data: filteredData, page, limit });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

//Get sorted On bench
const getSortedAllocationsOnBench = async (req, res) => {
  const fieldName = req.query.sort;
  const query = getAllocationQuery(req.query);
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let code, message;
  let sortByAscending = 1;
  if (fieldName === constant.FIELD_YOE) {
    sortByAscending = -1;
  }
  try {
    code = constant.HTTP_200_CODE;
    message = constant.GET_ALLOCATION_BENCH_SUCCESS;
    const projectDetails = await allocationModel
      .find({})
      .populate(
        "empId",
        "_id orgEmpId name primaryCapability designation skillSet yearsOfExperience"
      )
      .populate(
        "projectId",
        "_id vbProjectId startDate endDate vbProjectStatus projectName"
      );
    const employeesData = await Employee.find(
      { status: constant.STATUS_ACTIVE },
      {
        orgEmpId: 1,
        name: 1,
        primaryCapability: 1,
        designation: 1,
        skillSet: 1,
        yearsOfExperience: 1,
      }
    ).sort([[fieldName, sortByAscending]]);

    let filteredData = getOnBenchFilteredData(
      query,
      projectDetails,
      employeesData
    );
    const compare = (a, b) => {
      if (a.remainingAllocation < b.remainingAllocation) {
        return -1;
      }
      if (a.remainingAllocation > b.remainingAllocation) {
        return 1;
      }
      return 0;
    };
    if (fieldName === constant.FIELD_REMAIN_ALLOCATION) {
      filteredData = filteredData.sort(compare);
    }
    const data = customPagination({ data: filteredData, page, limit });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

const getTotalAllocationByEmpId = async (req, res) => {
  let empId = "";
  let code, message, resData;
  if (req.params.empId) {
    empId = req.params.empId;
  }
  try {
    const projectDetails = await allocationModel
      .find({})
      .populate("empId", "_id orgEmpId name")
      .populate(
        "projectId",
        "_id vbProjectId startDate endDate vbProjectStatus projectName"
      );

    let totalAllocation = getTotalAllocationCalculated(
      empId,
      projectDetails,
      req.query.date,
      req.query.endDate
    );
    if (totalAllocation > 100) {
      totalAllocation = 100;
    }

    code = constant.HTTP_200_CODE;
    message = constant.GET_ALLOCATION_EMPID_SUCCESS;
    resData = customResponse({ code, message, data: totalAllocation });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

//For EI integration
//For PMO integration with Employee
const getFilteredEmployee = async (req, res) => {
  let code, message, resData;
  const query = req.query;
  try {
    if (Object.keys(req.query).length === 0) {
      const filterEmployee = await Employee.find(
        { status: constant.STATUS_ACTIVE },
        { orgEmpId: 1, name: 1, primaryCapability: 1 }
      );
      return res.status(200).send(filterEmployee);
    } else {
      const filterEmployee = await Employee.find(
        {
          status: constant.STATUS_ACTIVE,
          $or: [
            {
              name: {
                $regex: query.empName.trim(),
                $options: "i",
              },
            },
            {
              orgEmpId: {
                $regex: query.empName.trim(),
                $options: "i",
              },
            },
          ],
        },
        { orgEmpId: 1, name: 1, primaryCapability: 1 }
      );
      code = constant.HTTP_200_CODE;
      message = constant.GET_FILTERED_EMPLOYEES_SUCCESS;
      resData = customResponse({ code, message, data: filterEmployee });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

//Managers
const getManagers = async (req, res) => {
  let code, message, resData;
  try {
    const filterManagers = await Employee.find(
      {
        $or: [
          {
            designation: constant.DESIGNATION_MANAGER,
            name: {
              $regex: req.query.empName,
              $options: "i",
            },
          },
        ],
      },
      { _id: 0, orgEmpId: 1, name: 1 }
    );
    code = constant.HTTP_200_CODE;
    message = constant.GET_MANAGERS_SUCCESS;
    resData = customResponse({ code, message, data: filterManagers });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

// Getting all projects for a particular employee
const getProjectsByEmpId = async (req, res) => {
  let code, message;
  try {
    const id = req.query.id;
    code = constant.HTTP_200_CODE;
    const getDetails = await allocationModel
      .find({ empId: id })
      .populate("projectId", "projectName clientName");
    const resData = customResponse({ code, data: getDetails });
    return res.status(code).send(resData);
  } catch (error) {
    code = code.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};
const updateProjectDescription = async (req, res) => {
  let code, message;
  try {
    const id = req.query.id;
    code = constant.HTTP_200_CODE;
    message = constant.UPDATE_PROJECT_DESCRIPTION_SUCCESS;
    const getDetails = await allocationModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          description: req.body.description,
        },
      }
    );
    const resData = customResponse({ code, message, data: getDetails });
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

module.exports = {
  createAllocations,
  updateAllocation,
  deleteAllocation,
  getAllocations,
  getSortedAllocations,
  getAllocationsOnBench,
  getSortedAllocationsOnBench,
  getTotalAllocationByEmpId,
  getFilteredEmployee,
  getManagers,
  getProjectsByEmpId,
  updateProjectDescription,
  updateResData,
};
