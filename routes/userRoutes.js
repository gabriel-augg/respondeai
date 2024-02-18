import { Router } from "express";
import { checkAuth } from "../helpers/auth.js"
import UserController from "../controllers/userController.js";

const userRouter = Router()

userRouter.get('/perfil', checkAuth, UserController.showAccountInfo)
userRouter.post('/perfil', UserController.updateAccountInfo)

export { userRouter }