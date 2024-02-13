import { Answer } from "../models/Answer.js"

export default class AnswerController{
    static async toAnswer(req, res){
        const { title, questionId, id } = req.body

        const answer = {
            title,
            QuestionId: questionId,
            UserId: id
        }

        try {
            await Answer.create(answer)
            res.redirect(`/pergunta/${questionId}`)
        } catch (error) {
            
        }
    }

    static async likePost(req, res){
        const { id } = req.body

        try {
            const answer = await Answer.findOne({where: {id:id}, raw: true})
            answer.like += 1
            await Answer.update(answer, {where: {id:id}})

            res.redirect(`/pergunta/${answer.QuestionId}`)
        } catch (error) {
            console.log(error)
        }

        


    }
}