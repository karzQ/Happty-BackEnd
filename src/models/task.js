const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    type: {
        type: String,
        required: 'A type is required'
    },
    content: {
        type: String,
        required: 'A content is required',
        trim: true
    },
    assignedId: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: 'An isCompleted state is required'
    }
})

taskSchema.plugin(uniqueValidator, { message: "Error, expected \"${PATH}\" ({VALUE}) to be unique."})
module.exports = mongoose.model("Task", taskSchema);