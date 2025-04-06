import { Router } from "express";
import { changePassword, profile, updateUserInfo, changeEmail} from "../controllers/users.controller.js";


const usersRouter = Router();


usersRouter.get("/profile", profile);
usersRouter.patch("/update-email", changeEmail);
usersRouter.patch("/update-password", changePassword); // Assuming you want to use the same function for updating password
usersRouter.patch("/update-user", updateUserInfo); // Assuming you want to use the same function for updating username



export default usersRouter;