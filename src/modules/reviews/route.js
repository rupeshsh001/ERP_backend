const express = require("express");
const { hasPermission } = require("../../middleware/auth");

const {
  getAllReviews,
  createReview,
  getReview,
  updateReviewStatus,
  deleteReview,
} = require("./controller");
const router = express.Router();

router.get("/", hasPermission("view_employee_dashboard"), getAllReviews);
router.post("/", createReview);
router.get("/:id", hasPermission("view_employee_dashboard"), getReview);
router.patch(
  "/:id",
  hasPermission("approve_employee_edit_request"),
  updateReviewStatus
);
router.delete("/:id", hasPermission("create_employee_dashboard"), deleteReview);

module.exports = router;
