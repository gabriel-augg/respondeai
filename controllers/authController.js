import { User } from "../models/User.js"
import bcrypt from "bcrypt";

export default class AuthController{

    static signin(req, res){
        res.render('auth/signin')
    }

    static async signinPost(req, res){

        const { email, password } = req.body;

        const user = await User.findOne({where: {email:email}})

        if(!user){
            console.log('Usuário não encontrado!')
            res.render('auth/signin')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            console.log('As senhas não conferem!')
            res.render('auth/signin')
            return
        }

        req.session.userid = user.id

        console.log('Logado com sucesso!')

        req.session.save(()=>{
            res.redirect('/')
        })
    }

    static signup(req, res){
        res.render('auth/signup')
    }

    static async signupPost(req, res){

        const { name, email, password, confirmpassword } = req.body

        if(password != confirmpassword){
            console.log('Senhas não conferem!')
            res.render('auth/signup')
            return
        }

        const checkIfUserExists = await User.findOne({where: {email:email}})
        if(checkIfUserExists){
            console.log('O usuário já existe')
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        try {
            const user = {
                name,
                email,
                password: hashPassword
            }

            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.session.save(()=>{
                res.redirect('/')
            })
  
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }

}