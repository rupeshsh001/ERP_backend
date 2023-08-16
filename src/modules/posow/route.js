const express = require("express");
const router = express.Router();
const { hasPermission } = require("../../middleware/auth");
const {
  downloadFile,
  getPoDetail,
  getSortedPoList,
  getClients,
  getProjectsByClient,
  getDetails,
  createPoSow,
  uploadFile,
  updatePODetails,
} = require("./controller");

router.get("/file/:fileName", hasPermission("view_CMS"), downloadFile);

router.get("/details", hasPermission("view_CMS"), getDetails);

router.get("/clients", hasPermission("view_CMS"), getClients);

router.get("/sort/:fieldName", hasPermission("view_CMS"), getSortedPoList);

router.get("/:id", hasPermission("view_CMS"), getPoDetail);

router.get(
  "/clients/:clientName",
  hasPermission("view_CMS"),
  getProjectsByClient
);

router.post("/", hasPermission("upload_PO/SOW/contract"), createPoSow);

router.post("/file", hasPermission("upload_PO/SOW/contract"), uploadFile);

router.patch("/:id", hasPermission("upload_PO/SOW/contract"), updatePODetails);

module.exports = router;
