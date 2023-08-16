//importing packages
const express = require("express");
const router = express.Router();
const { hasPermission } = require("../../middleware/auth");

//importing from controller
const {
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
} = require("./controller.js");

router.post("/", hasPermission("view_leave_dashboard"), createLeave);
router.patch(
  "/",
  hasPermission("view_leave_dashboard"),
  updateLeaveStatus
);
router.get("/review", hasPermission("approve_leave"), getLeaveForApproval);
router.get(
  "/applied",
  hasPermission("view_leave_dashboard"),
  getUserAppliedLeaves
);
router.get("/", hasPermission("view_leave_dashboard"), getAllLeaves);
router.get(
  "/project",
  hasPermission("view_leave_dashboard"),
  getAllEmpLeavesByProject
);
router.get("/records", getLeaveRecords);
router.post("/upload", hasPermission("view_leave_dashboard"), uploadDoc);
router.get(
  "/download/:fileName",
  hasPermission("view_leave_dashboard"),
  downloadDoc
);

// POST request
router.post("/type", hasPermission("view_configurator"), createLeaveType);

// GET Method
router.get("/type", hasPermission("view_leave_dashboard"), getLeaveTypes);

//Patch
router.patch("/type", hasPermission("view_configurator"), updateLeaveTypes);

//delete
router.delete("/type", hasPermission("view_configurator"), deleteLeaveType);

module.exports = router;
