//importing packages
const express = require("express");
const holidayRouter = express.Router();
const { hasPermission } = require("../../middleware/auth");

//importing from controller
const {
  createHoliday,
  getAllHolidays,
  updateHoliday,
  handleMultipleHolidayStatus,
} = require("./controller");

// POST request
holidayRouter.post("/", hasPermission("view_configurator"), createHoliday);

// GET Method
holidayRouter.get("/", hasPermission("view_leave_dashboard"), getAllHolidays);
// holidayRouter.get("/:type", getHolidayByType);

//Patch
holidayRouter.patch("/:id", hasPermission("view_configurator"), updateHoliday);

holidayRouter.put(
  "/",
  hasPermission("view_configurator"),
  handleMultipleHolidayStatus
);

module.exports = holidayRouter;
