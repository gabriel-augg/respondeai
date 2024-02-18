import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router()

userRouter.get('/perfil', UserController.showAccountInfo)
userRouter.post('/perfil', UserController.updateAccountInfo)

export { userRouter }