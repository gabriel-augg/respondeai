import { Answer } from "../models/Answer.js"

export default class AnswerController{

    static async createAnswer(req, res){

        const { title, questionId, id } = req.body

        const answer = {
            title,
            QuestionId: questionId,
            UserId: id
        }

        try {

            await Answer.create(answer)

            req.flash('success', 'Resposta publicada com sucesso!')

            req.session.save(()=> {
                res.redirect(`/perguntas/${questionId}`)
            })

        } catch (error) {
            console.log(error)
        }
    }

    static async likePost(req, res){

        const id = req.body.id

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