const express = require("express");
const {
  getAllWeek,
  createWeek,
  updateWeek,
  deleteWeek,
} = require("./controller");
const router = express.Router();
const { hasPermission } = require("../../middleware/auth");

router.get("/", hasPermission("view_leave_dashboard"), getAllWeek);
router.post("/", hasPermission("view_configurator"), createWeek);
router.patch("/", hasPermission("view_configurator"), updateWeek);

module.exports = router;
