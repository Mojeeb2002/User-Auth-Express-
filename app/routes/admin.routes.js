import { Router } from "express";
import { adminRole } from "../middlewares/auth.middleware.js";
import { adminDashboard, createNewUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/admin.controller.js";


const adminRouter = Router();

adminRouter.get("/", adminRole, adminDashboard);
adminRouter.get("/users", adminRole, getAllUsers);
adminRouter.get("/users/:id", adminRole, getUserById);
adminRouter.post("/users", adminRole, createNewUser);
adminRouter.patch("/users/:id", adminRole, updateUser);
adminRouter.delete("/users/:id", adminRole, deleteUser);



export default adminRouter;