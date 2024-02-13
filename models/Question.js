import { sequelize as db } from "../db/conn.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";

const Question = db.define('Question', {
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

export { Question }

Question.belongsTo(User)
User.hasMany(Question)

