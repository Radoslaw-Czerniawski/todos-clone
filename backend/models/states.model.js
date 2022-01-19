const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newStates = new Schema(
    {
        length: {
            type: Number,
            required: false,
        },
        currentlyRendering: {
            type: String,
            required: false
        },
        login: {
            type: String,
            required: true
        },
    }
);

const States = mongoose.model("states", newStates);

module.exports = States;
