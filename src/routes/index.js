var express = require("express");
var router = express.Router();

const userRoutes = require("../modules/users/route");
const poSowRoutes = require("./../modules/posow/route");
const leaveRouter = require("../modules/leaves/route");
const cimsRoutes = require("../modules/clients/route");
const rolesRoutes = require("../modules/roles/route");
const otherRoutes = require("../modules/others/route");
const invoiceRoutes = require("./../modules/invoice/route");
const {
  auth,
  getAccount,
  validateToken,
  logout,
  setPassword,
  resetPassword,
} = require("../modules/users/controller");
const { isAuthorized } = require("../middleware/auth");
const reviewRoutes = require("../modules/reviews/route");
const employeeRoutes = require("../modules/employee/route");
const weekDayRoutes = require("../modules/weekdays/route");
const dropdownRoutes = require("../modules/dropDown/route");
const ProjectRouter = require("../modules/projects/route");
const ProjectEmployeeRouter = require("../modules/allocations/route");
const universityRoutes = require("../modules/universities/route");
const holidayRouter = require("../modules/holiday/route");
const fallBackRoute = require("../modules/fallback/route");
const helpDesk = require("../modules/helpdesk/route");

router.use("/dropdowns", isAuthorized, dropdownRoutes);
router.post("/login", auth);
router.get("/reset-password", resetPassword);
router.get("/account", isAuthorized, getAccount);
router.use("/users", userRoutes);
router.use("/", otherRoutes);
router.use("/invoice", isAuthorized, invoiceRoutes);
router.use("/posow", isAuthorized, poSowRoutes);
router.use("/employees", isAuthorized, employeeRoutes);
router.use("/reviews", isAuthorized, reviewRoutes);
router.use("/projects", isAuthorized, ProjectRouter);
router.use("/allocations", isAuthorized, ProjectEmployeeRouter);
router.use("/cims", isAuthorized, cimsRoutes);
router.use("/roles", isAuthorized, rolesRoutes);
router.use("/leaves", isAuthorized, leaveRouter);
router.use("/universities", isAuthorized, universityRoutes);
router.get("/validate-token", isAuthorized, validateToken);
router.get("/logout", isAuthorized, logout);
router.put("/:id/password", setPassword);
router.use("/weekday", isAuthorized, weekDayRoutes);
router.use("/holiday", isAuthorized, holidayRouter);
router.use("/fallBack", isAuthorized, fallBackRoute);
router.use("/helpdesk", isAuthorized, helpDesk);

module.exports = router;
