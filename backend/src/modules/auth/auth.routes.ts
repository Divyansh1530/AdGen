import { Router } from "express";
import { loginUser, registerUser, getCurrentUser, refreshAccessToken, logoutUser } from "./auth.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me", authenticate, getCurrentUser);
router.post("/refresh",refreshAccessToken)
router.post("/logout",logoutUser)

export default router
