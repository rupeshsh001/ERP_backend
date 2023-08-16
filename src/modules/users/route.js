var express = require("express");
var router = express.Router();

const { isAuthorized, hasPermission } = require("../../middleware/auth");
const {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
  createUserWhileImport,
  updateUserByEmail,
} = require("./controller");

router.get("/", isAuthorized, getUserList);
router.get("/:id", getUserDeatil);
router.post("/", isAuthorized, addUser);
router.post("/create-user-while-import", isAuthorized, createUserWhileImport);
router.put("/:id", isAuthorized, updateUser);
router.patch(
  "/:email",
  isAuthorized,
  hasPermission("create_employee_dashboard"),
  updateUserByEmail
);
router.delete("/:id", isAuthorized, deleteUser);

module.exports = router;
