const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newUsers = new Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        }
    }
);

const Users = mongoose.model("users", newUsers);

module.exports = Users;
