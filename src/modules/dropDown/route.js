const express = require("express");
const router = express.Router();

const {
  createDropdown,
  updateDropdown,
  deleteDropdown,
  editDropDownLabelStatus,
  getDropdowns,
  handleUpdate,
  handleGetDropdownByIdentifier,
} = require("./controller");

router.get("/", getDropdowns);
router.get("/:identifier", handleGetDropdownByIdentifier);
router.post("/", createDropdown);
router.put("/", handleUpdate);
router.patch("/", editDropDownLabelStatus);
router.patch("/:id", updateDropdown);
router.delete("/:id", deleteDropdown);

module.exports = router;
