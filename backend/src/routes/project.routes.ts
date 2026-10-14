import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/project.controller";

const router = Router()

router.post("/",authenticate,createProject)
router.get("/",authenticate,getProjects)
router.get("/:projectId",authenticate,getProjectById)
router.patch("/:projectId",authenticate,updateProject)
router.delete("/:projectId",authenticate,deleteProject)

export default router