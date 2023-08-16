//importing packages
const express = require("express");
const ProjectRouter = express.Router();
const { hasPermission } = require("../../middleware/auth");

//importing from controller
const {
  getProjects,
  getProjectById,
  createProjects,
  updateProject,
  updateAllProjectByClientId,
} = require("./controller");

// POST request
ProjectRouter.post("/", hasPermission("create_project_in_PMO"), createProjects);

//PUT method for update
ProjectRouter.put(
  "/:id",
  hasPermission("update_project_in_PMO"),
  updateProject
);

ProjectRouter.put(
  "/client/:id",
  hasPermission("update_project_in_PMO"),
  updateAllProjectByClientId
);

// GET Method for Active Projects
ProjectRouter.get("/", hasPermission("view_PMO_module"), getProjects);

//GET Method by id
ProjectRouter.get("/:id", hasPermission("view_PMO_module"), getProjectById);

module.exports = ProjectRouter;
