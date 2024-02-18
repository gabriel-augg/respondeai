import { Router } from "express";
import AnswerController from "../controllers/answerController.js";

const answerRouter = Router()

answerRouter.post('/resposta', AnswerController.toAnswer)
answerRouter.post('/resposta-like', AnswerController.likePost)

export { answerRouter }