import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { createProject, deleteProject, getProjectById, getProjects, updateProject, uploadProjectImages } from "./project.controller";
import { uploadProjectImages as uploadImages }   from "../../middleware/multer.middleware";

const router = Router()

router.post("/",authenticate,createProject)
router.get("/",authenticate,getProjects)
router.get("/:projectId",authenticate,getProjectById)
router.patch("/:projectId",authenticate,updateProject)
router.delete("/:projectId",authenticate,deleteProject)
router.post("/:projectId/images", authenticate ,uploadImages ,uploadProjectImages )


export default router