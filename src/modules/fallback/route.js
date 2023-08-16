const express = require("express");
const router = express.Router();
const {
  getFallBackTime,
  updateFallBackTime,
} = require("./controller");
const { hasPermission } = require("../../middleware/auth");

router.get("/", hasPermission("view_configurator"), getFallBackTime);
router.post("/", hasPermission("view_configurator"), updateFallBackTime);

module.exports = router;
