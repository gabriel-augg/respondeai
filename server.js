import express from "express"
import exphbs from 'express-handlebars'
import session from "express-session"
import FileStore from "session-file-store"
import flash from "express-flash"
import { sequelize as conn } from "./db/conn.js"
import { authRouter } from "./routes/authRoutes.js"


const fileStoreInstance = FileStore(session)
const port = 3000
const app = express()

import RespondeAiController from "./controllers/respondeAiController.js"

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
// app.use(flash())
app.use(express.static('public'))

app.use('/', authRouter)
app.get('/', RespondeAiController.showComments)


conn.sync().then(()=> {
    app.listen(port)
})
.catch(error => console.log(error))


