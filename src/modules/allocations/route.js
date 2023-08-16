//importing express
const express = require("express");
const ProjectEmployeeRouter = express.Router();
const { hasPermission } = require("../../middleware/auth");

//importing from controller
const {
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
} = require("./controller");

// POST request
ProjectEmployeeRouter.post(
  "/",
  hasPermission("create_project_in_PMO"),
  createAllocations
);

// PUT request
ProjectEmployeeRouter.put(
  "/",
  hasPermission("update_project_in_PMO"),
  updateAllocation
);

ProjectEmployeeRouter.get(
  "/",
  hasPermission("view_PMO_module"),
  getSortedAllocations
);

ProjectEmployeeRouter.get(
  "/onbench",
  hasPermission("view_PMO_module"),
  getSortedAllocationsOnBench
);

/* ********************************** */
// Getting employee module's integrated data
ProjectEmployeeRouter.get(
  "/employees",
  hasPermission("view_PMO_module"),
  getFilteredEmployee
);
ProjectEmployeeRouter.get(
  "/managers",
  hasPermission("view_PMO_module"),
  getManagers
);
ProjectEmployeeRouter.get(
  "/projects",
  hasPermission("search_employee"),
  getProjectsByEmpId
);
ProjectEmployeeRouter.put(
  "/project",
  hasPermission("search_employee"),
  updateProjectDescription
);

// PUT request
ProjectEmployeeRouter.put(
  "/:id",
  hasPermission("update_project_in_PMO"),
  updateResData
);

// GET request
ProjectEmployeeRouter.get(
  "/:empId",
  hasPermission("view_PMO_module"),
  getTotalAllocationByEmpId
);

// DELETE request
ProjectEmployeeRouter.delete(
  "/:id",
  hasPermission("create_project_in_PMO"),
  deleteAllocation
);

module.exports = ProjectEmployeeRouter;
