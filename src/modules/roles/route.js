const express = require("express");
const router = express.Router();

const { isAuthorized } = require("../../middleware/auth");
const { getRoles, getAllRoles } = require("./controller");

router.get("/", getRoles);

module.exports = router;
