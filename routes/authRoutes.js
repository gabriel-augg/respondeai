import { Router } from "express"
import AuthController from "../controllers/authController.js"

const authRouter = Router()


authRouter.get('/entrar', AuthController.signin)
authRouter.post('/entrar', AuthController.signinPost)
authRouter.get('/cadastrar', AuthController.signup)
authRouter.post('/cadastrar', AuthController.signupPost)
authRouter.get('/sair', AuthController.logout)

export { authRouter }