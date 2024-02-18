import session from "express-session"
import { User } from "../models/User.js"
import { Question } from "../models/Question.js"
import { Answer } from "../models/Answer.js"
import { Op } from "sequelize"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"








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


       questions.forEach(question => {
        question.answerQty = question.Answers.length
        question.timeago = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: ptBR })
        })

        let checkIfThereIsntQuestion = (questions.length == 0 ) ? true : false

        
        res.render('templates/home', {questions, checkIfThereIsntQuestion})

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
            req.flash('message', 'Porfavor, preencha o campo!')
            console.log('caiu aqui')
            res.render('templates/toQuestion')
            return
        }

        const question = {
            title: req.body.title,
            UserId: req.session.userid
        }

        await Question.create(question)

        try {
            req.flash('success', 'Pergunta publicada com sucesso!')
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
            question.timeago = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: ptBR })
            const userName = question['User.name']
            const conectedUser = await User.findOne({where: {id:userId}, raw: true})
            const answersData = await Answer.findAll({where: {QuestionId:question.id}, include: User, order: [['like', 'DESC']]})
            const answers = answersData.map((result) => result.get({plain: true}))
            answers.forEach(answer => {
                answer.timeago = formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: ptBR })
            })

            let checkIfThereIsntAnswers = (answers.length == 0) ? true : false
    
            res.render('templates/question', { question, userName, conectedUser, answers, checkIfThereIsntAnswers } )
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

    static async showUserQuestions(req, res){
        const id = req.session.userid

        const questionsData = await Question.findAll({where: {UserId:id}, include: Answer})

        const questions = questionsData.map((result) => result.get({plain: true}))

        questions.forEach(question => {
            question.answerQty = question.Answers.length
            question.timeago = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: ptBR })
        })

        let checkIfThereIsntQuestion = (questions.length == 0) ? true : false


        res.render('templates/myQuestions', {questions, checkIfThereIsntQuestion})
    }

    static async showUserQuestion(req, res){
        const id = req.params.id
        const userId = req.session.userid

        try {
            const question = await Question.findOne({where: {id:id}, raw: true, include: User})
            question.timeago = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: ptBR })
            const userName = question['User.name']
            const conectedUser = await User.findOne({where: {id:userId}, raw: true})
            const answersData = await Answer.findAll({where: {QuestionId:question.id}, include: User, order: [['like', 'DESC']]})
            const answers = answersData.map((result) => result.get({plain: true}))
            answers.forEach(answer => {
                answer.timeago = formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: ptBR })
            })

            let checkIfThereIsntAnswers = ( answers.length == 0 ) ? true : false
    
            res.render('templates/myQuestion', { question, userName, conectedUser, answers, checkIfThereIsntAnswers } )
        } catch (error) {
            console.log(error)
        }
    }

    static async updateQuestion(req, res){

        const id = req.body.id

        const question = {
            title: req.body.title
        }

        await Question.update(question, {where: {id:id}})

        try {
            req.flash('success', 'Pergunta editada com sucesso!')
            req.session.save(()=> {
                res.redirect(`/minhas-perguntas/${id}`)
            })
        } catch (error) {
            console.log('Aconteceu um erro: ' + error)
        }

    }

    static async removeQuestion(req, res){
        const id = req.body.id

        await Question.destroy({where: {id:id}})

        try {
            req.session.save(()=> {
                req.flash('success', 'Pergunta excluida com sucesso!')
                res.redirect(`/minhas-perguntas`)
            })
        } catch (error) {
            console.log(error)
        }
    }

}