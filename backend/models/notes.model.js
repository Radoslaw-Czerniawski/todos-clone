const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    text: { type: String, required: false },
    isActive: { type: Boolean, required: false },
    _id: { type: String, required: false },
    login: { type: String, required: true },
})

const Notes = mongoose.model('Notes', noteSchema);

module.exports = Notes;

