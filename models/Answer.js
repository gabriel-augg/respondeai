import { sequelize as db } from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Question } from "./Question.js";
import { User } from "./User.js";

const Answer = db.define('Answer', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    }
})

export { Answer }

Answer.belongsTo(Question)
Answer.belongsTo(User)
Question.hasMany(Answer)
User.hasMany(Answer)


