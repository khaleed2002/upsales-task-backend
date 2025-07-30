import { Router } from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken); // No validation needed
router.post("/logout", authenticate, logout);

export default router;
