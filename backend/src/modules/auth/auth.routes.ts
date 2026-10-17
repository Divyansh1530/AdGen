import { Router } from "express";
import { loginUser, registerUser, getCurrentUser, refreshAccessToken, logoutUser } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me", authenticate, getCurrentUser);
router.post("/refresh",refreshAccessToken)
router.post("/logout",logoutUser)

export default router
