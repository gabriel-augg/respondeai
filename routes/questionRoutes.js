import { Router } from "express";
import { checkAuth } from "../helpers/auth.js"
import questionController from "../controllers/questionController.js";

const questionRouter = Router()

questionRouter.get('/perguntar', checkAuth, questionController.toQuestion)
questionRouter.post('/perguntar', questionController.toQuestionPost)
questionRouter.post('/like', questionController.like)
questionRouter.get('/pergunta/:id', checkAuth, questionController.showQuestion)
questionRouter.get('/minhas-perguntas', checkAuth, questionController.showUserQuestions)
questionRouter.get('/minhas-perguntas/:id', checkAuth, questionController.showUserQuestion)
questionRouter.post('/atualizar-pergunta', questionController.updateQuestion)
questionRouter.post('/deletar-pergunta', questionController.removeQuestion)


export { questionRouter }

