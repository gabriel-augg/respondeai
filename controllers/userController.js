import { User } from "../models/User.js"
import { Question } from "../models/Question.js"
import bcrypt from "bcrypt";

export default class UserController {
    static async showAccountInfo(req, res){
        const id = req.session.userid

        try {
            const user = await User.findOne({where: {id:id}, raw: true})

            res.render('templates/profile', { user })
        } catch (error) {
            console.log(err)
        }

  


    }

    static async updateAccountInfo(req, res){
        const id = req.session.userid
        const { name, email, password, newPassword } = req.body

        let user = await User.findOne({where: {id:id}, raw: true})


        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            console.log('As senhas não conferem!')
            res.render('templates/perfil')
            return
        }

        if(name){
            user.name = name
        }

        if(email){
            user.email = email
        }

        if(newPassword){
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(newPassword, salt);
            user.password = hashPassword
        }

        await User.update(user, {where: {id:id}})

        
        try {
            // req.flash('message', "Pensamento atualizado com sucesso!")

            req.session.save(()=> {
                res.redirect('/perfil')
            })
        } catch (error) {
            console.log('Aconteceu um erro: ' + error)
        }

      

    }
}