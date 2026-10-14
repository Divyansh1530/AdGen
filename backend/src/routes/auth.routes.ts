import { Router } from "express";
import { loginUser, registerUser, getCurrentUser } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me", authenticate, getCurrentUser);

export default router
