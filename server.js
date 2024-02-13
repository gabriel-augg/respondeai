import path from "path"
import os from 'os'
import express from "express"
import { engine } from 'express-handlebars'
import session from "express-session"
import FileStore from "session-file-store"
import flash from "express-flash"
import { sequelize as conn } from "./db/conn.js"
import questionController from "./controllers/questionController.js"
import { authRouter } from "./routes/authRoutes.js"
import { questionRouter } from "./routes/questionRoutes.js"
import { answerRouter } from "./routes/answerRouter.js"
import { User } from "./models/User.js"


const fileStoreInstance = FileStore(session)
const port = 3000
const app = express()



app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use( 
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new fileStoreInstance({
            logFn: function(){},
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true 
        }
    })
)

app.use( async (req, res, next) => {
    // se o usuário estiver logado, mando a sessão que está na requisição para a resposta
    // para acessar no frontend
    // (Aqui onde fica armazenado os dados do usuário logado)
    if (req.session.userid) {
        const user = await User.findOne({ where: { id: req.session.userid } });

        // Crie um objeto para armazenar a sessão e o nome do usuário
        res.locals.userData = {
            session: req.session,
            name: user.name
        };
    }
    // Se o usuário não estiver logado, eu passo a sessão
    next()

})

app.use(express.json())
app.use(flash())
app.use(express.static('public'))

app.use('/', authRouter)
app.use('/', questionRouter)
app.use('/', answerRouter)
app.get('/', questionController.showQuestions)


conn.sync().then(()=> {
    app.listen(port)
})
.catch(error => console.log(error))


