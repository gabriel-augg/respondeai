import session from "express-session"
import { User } from "../models/User.js"
import { Question } from "../models/Question.js"
import { Answer } from "../models/Answer.js"
import { Op } from "sequelize"

export default class questionController{
    static async showQuestions(req, res){

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const questionsData = await Question.findAll({
            include: [
                {model: User},
                {model: Answer}
            ],
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        })

        const questions = questionsData.map((result) => result.get({plain: true}))


       questions.forEach(question => question.qty = question.Answers.length)


        res.render('templates/home', {questions})

    }

    static async toQuestion(req, res){

        const userId = req.session.userid

        try {

            const user = await User.findOne({where: {id:userId}, raw: true})
            res.render('templates/toQuestion', {user})

        } catch (error) {

        }


    }

    static async toQuestionPost(req, res){

        if(!req.body.title){
            console.log('por favor, preecha o campo')
            return
        }

        const question = {
            title: req.body.title,
            UserId: req.session.userid
        }

        await Question.create(question)

        try {
            req.session.save(()=> {
                res.redirect('/')
            })
        } catch(err){
            console.log("Aconteceu um erro: " + err)
        }
    }

    static async showQuestion(req, res){
        const id = req.params.id
        const userId = req.session.userid

        try {
            const question = await Question.findOne({where: {id:id}, raw: true, include: User})
            const userName = question['User.name']
            const conectedUser = await User.findOne({where: {id:userId}, raw: true})
            const answersData = await Answer.findAll({where: {QuestionId:question.id}, include: User, order: [['like', 'DESC']]})
            const answers = answersData.map((result) => result.get({plain: true}))
    
            res.render('templates/question', { question, userName, conectedUser, answers } )
        } catch (error) {
            console.log(error)
        }


    }

    static async like(req, res){
        const id = req.body.id

        const question = await Question.findOne({where: {id:id}, raw: true})

        question.like += 1

        await Question.update(question, {where: {id:id}})

        req.session.save(()=> {
            res.redirect('/')
        })

    }

}