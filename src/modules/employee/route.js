const express = require("express");
const { hasPermission } = require("../../middleware/auth");
const router = express.Router();
const {
  generateQR,
  getEmployee,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployeesRR,
  getPicture,
  importEmployees,
  grethrImport,
  uploadPicture,
  deletePicture,
} = require("./controller");

router.get("/qr", hasPermission("view_employee_dashboard"), generateQR);

router.get("/", hasPermission("view_employee_dashboard"), getAllEmployees);

router.get("/:id", hasPermission("view_employee_dashboard"), getEmployee);

router.post("/", hasPermission("create_employee_dashboard"), createEmployee);

router.patch("/:id", hasPermission("edit_employee_dashboard"), updateEmployee);

router.delete(
  "/:id",
  hasPermission("create_employee_dashboard"),
  deleteEmployee
);

router.get(
  "/picture/:fileName",
  hasPermission("view_employee_dashboard"),
  getPicture
);

router.post(
  "/import",
  hasPermission("create_employee_dashboard"),
  importEmployees
);

router.post(
  "/greythr-import",
  hasPermission("create_employee_dashboard"),
  grethrImport
);

router.post(
  "/picture",
  hasPermission("edit_employee_dashboard"),
  uploadPicture
);

router.delete(
  "/picture/:fileName",
  hasPermission("edit_employee_dashboard"),
  deletePicture
);

module.exports = router;
