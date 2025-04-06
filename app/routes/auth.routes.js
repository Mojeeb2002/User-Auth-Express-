import { Router } from "express";
import { login, register, logout, verifyEmail, forgotPassword, resetPassword,} from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middlewares/auth.middleware.js";

const AuthRouter = Router();


AuthRouter.post("/register", register);
AuthRouter.post("/login", loginRateLimiter, login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/verify-email/:token", verifyEmail);
AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.post("/reset-password", resetPassword)

export default AuthRouter;
