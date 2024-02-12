import { sequelize as db } from "../db/conn.js";
import { DataTypes } from "sequelize";

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        require: true
    },
    email: {
        type: DataTypes.STRING,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        require: true
    },
})

export { User }
