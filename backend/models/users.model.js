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
        },
        isAdmin: {
            type: Boolean,
            required: false,
        }
    }
);

const Users = mongoose.model("users", newUsers);

module.exports = Users;
