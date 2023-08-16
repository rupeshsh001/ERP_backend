const { reduce, values } = require("lodash");
const moment = require("moment");

const getQueryString = (queryString) => {
  let query = [
    {
      vbProjectManager: { $regex: "", $options: "i" },
    },
  ];

  if (queryString.vbProjectStatus) {
    query.push({
      vbProjectStatus: {
        $regex: queryString.vbProjectStatus,
        $options: "i",
      },
    });
  }

  if (queryString.clientName) {
    query.push({
      clientName: {
        $regex: queryString.clientName,
        $options: "i",
      },
    });
  }

  if (queryString.vbProjectId) {
    query.push({
      vbProjectId: {
        $regex: queryString.vbProjectId,
        $options: "i",
      },
    });
  }

  if (queryString.projectName) {
    query.push({
      projectName: {
        $regex: queryString.projectName,
        $options: "i",
      },
    });
  }

  if (queryString.startDate) {
    query.push({
      startDate: {
        $regex: queryString.startDate,
        $options: "i",
      },
    });
  }

  if (queryString.endDate) {
    query.push({
      endDate: {
        $regex: queryString.endDate,
        $options: "i",
      },
    });
  }

  if (queryString.startDate) {
    query.push({
      startDate: {
        $regex: queryString.startDate,
        $options: "i",
      },
    });
  }

  if (queryString.endDate) {
    query.push({
      endDate: {
        $regex: queryString.endDate,
        $options: "i",
      },
    });
  }

  return query;
};

const getAllocationQuery = (queryString) => {
  const query = {};

  if (queryString.projectId) {
    query.projectId = queryString.projectId;
  }

  if (queryString.empId) {
    query.empId = queryString.empId;
  }

  if (queryString.empName) {
    query.empName = queryString.empName;
  }

  if (queryString.allocatedProject) {
    query.allocatedProject = queryString.allocatedProject;
  }

  if (queryString.percentage) {
    query.percentage = queryString.percentage;
  }

  if (queryString.remainingAllocation) {
    query.remainingAllocation = queryString.remainingAllocation;
  }

  if (queryString.startDate) {
    query.startDate = queryString.startDate;
  }

  if (queryString.endDate) {
    query.endDate = queryString.endDate;
  }

  return query;
};

const getAllocationsFilteredData = (findObj, projectDetails) => {
  let details = projectDetails;
  const curr_date = moment().format("YYYY-MM-DD");
  if (!findObj.projectId) {
    details = details.filter((detail) => {
      if (moment(curr_date).isSameOrBefore(detail.endDate)) {
        return detail;
      }
      return null;
    });
  }

  if (findObj.projectId) {
    details = details.filter((detail) =>
      detail.projectId._id.valueOf().toString().includes(findObj.projectId)
    );
  }
  if (findObj.empId) {
    details = details.filter((detail) =>
      detail.empId.orgEmpId.toString().includes(findObj.empId)
    );
  }

  if (findObj.empName) {
    details = details.filter((detail) =>
      detail.empId.name.toLowerCase().includes(findObj.empName.toLowerCase())
    );
  }

  if (findObj.projectId) {
    details = details.filter((detail) =>
      detail.projectId._id.valueOf().toString().includes(findObj.projectId)
    );
  }
  if (findObj.empId) {
    details = details.filter((detail) =>
      detail.empId.orgEmpId.toString().includes(findObj.empId)
    );
  }

  if (findObj.empName) {
    details = details.filter((detail) =>
      detail.empId.name.toLowerCase().includes(findObj.empName.toLowerCase())
    );
  }

  if (findObj.allocatedProject) {
    details = details.filter((detail) =>
      detail.projectId.projectName
        .toLowerCase()
        .includes(findObj.allocatedProject.toLowerCase())
    );
  }

  if (findObj.percentage) {
    details = details.filter(
      (detail) => detail.percentage === parseInt(findObj.percentage)
    );
  }

  if (findObj.startDate) {
    details = details.filter(
      (detail) => detail.startDate === findObj.startDate
    );
  }

  if (findObj.endDate) {
    details = details.filter((detail) => detail.endDate === findObj.endDate);
  }
  return details;
};

const getOnBenchFilteredData = (findObj, projectDetails, employeesData) => {
  const curr_date = moment().format("YYYY-MM-DD");
  const reduceData = reduce(
    projectDetails,
    (result, value) => {
      if (!result[value.empId.orgEmpId]) {
        result[value.empId.orgEmpId] = {
          orgEmpId: value.empId.orgEmpId,
          name: value.empId.name,
          primaryCapability: value.empId.primaryCapability,
          designation: value.empId.designation,
          skillSet: value.empId.skillSet,
          yearsOfExperience: value.empId.yearsOfExperience,
          remainingAllocation: 100,
          projects: [],
        };
      }

      if (
        moment(curr_date).isSameOrAfter(value.startDate) &&
        moment(curr_date).isSameOrBefore(value.endDate)
      ) {
        result[value.empId.orgEmpId].remainingAllocation =
          result[value.empId.orgEmpId].remainingAllocation - value.percentage;
      }

      result[value.empId.orgEmpId].projects.push({
        startDate: value.startDate,
        endDate: value.endDate,
        percentage: value.percentage,
        rackRate: value.rackRate,
        vbProjectId: value.projectId.vbProjectId,
        vbProjectStatus: value.projectId.vbProjectStatus,
        projectName: value.projectId.projectName,
      });
      return result;
    },
    {}
  );

  let details = values(reduceData);

  details = employeesData.map((employee) => {
    const filter = details
      ? details.filter((detail) => detail.orgEmpId === employee.orgEmpId)
      : [];

    if (filter.length) {
      return filter[0];
    } else {
      return {
        orgEmpId: employee.orgEmpId,
        name: employee.name,
        primaryCapability: employee.primaryCapability,
        designation: employee.designation,
        skillSet: employee.skillSet,
        yearsOfExperience: employee.yearsOfExperience,
        remainingAllocation: 100,
        projects: [],
      };
    }
  });

  if (details.length) {
    details = details.filter((obj) => obj.remainingAllocation > 0);
  }

  if (findObj.empId) {
    details = details.filter((detail) =>
      detail.orgEmpId.toString().includes(findObj.empId)
    );
  }

  if (findObj.empName) {
    details = details.filter((detail) =>
      detail.name.toLowerCase().includes(findObj.empName.toLowerCase())
    );
  }

  if (findObj.remainingAllocation) {
    details = details.filter(
      (detail) =>
        detail.remainingAllocation === parseInt(findObj.remainingAllocation)
    );
  }
  return details;
};

const getTotalAllocationCalculated = (
  empId,
  projectDetails,
  startDate,
  endDate
) => {
  let details = projectDetails;
  let detailsTest = projectDetails;
  let detailsTest2 = projectDetails;

  if (empId) {
    details = details.filter(
      (detail) =>
        detail.empId.orgEmpId.toString() === empId &&
        moment(detail.startDate, "YYYY-MM-DD").isBetween(
          startDate,
          endDate,
          "YYYY-MM-DD"
        )
    );
  }
  if (details.length === 0) {
    detailsTest = detailsTest.filter(
      (detail) =>
        detail.empId.orgEmpId.toString() === empId &&
        moment(startDate, "YYYY-MM-DD").isBetween(
          detail.startDate,
          detail.endDate,
          "YYYY-MM-DD",
          "[]"
        )
    );
  }
  if (detailsTest.length === 0) {
    detailsTest = detailsTest2.filter(
      (detail) =>
        detail.empId.orgEmpId.toString() === empId &&
        moment(endDate, "YYYY-MM-DD").isBetween(
          detail.startDate,
          detail.endDate,
          "YYYY-MM-DD",
          "[]"
        )
    );
  } else {
    detailsTest = detailsTest.filter(
      (detail) =>
        detail.empId.orgEmpId.toString() === empId &&
        moment(endDate, "YYYY-MM-DD").isBetween(
          detail.startDate,
          detail.endDate,
          "YYYY-MM-DD",
          "[]"
        )
    );
    if (detailsTest.length === 0) {
      detailsTest = detailsTest2.filter(
        (detail) =>
          detail.empId.orgEmpId.toString() === empId &&
          moment(startDate, "YYYY-MM-DD").isBetween(
            detail.startDate,
            detail.endDate,
            "YYYY-MM-DD",
            "[]"
          )
      );
    }
  }

  let totalAllocation;
  if (details.length != 0) {
    totalAllocation = reduce(
      details,
      (result, value) => result + value.percentage,
      0
    );
  } else {
    totalAllocation = reduce(
      detailsTest,
      (result, value) => result + value.percentage,
      0
    );
  }

  return empId ? totalAllocation : 0;
};

module.exports = {
  getQueryString,
  getAllocationQuery,
  getAllocationsFilteredData,
  getOnBenchFilteredData,
  getTotalAllocationCalculated,
};
