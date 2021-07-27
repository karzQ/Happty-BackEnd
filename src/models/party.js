const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Task = require('../models/task');
const Comment = require('../models/comment');

const partySchema = new Schema({
    hostId: {
        type: String,
        required: 'A hostId is required',
    },
    name: {
        type: String,
        required: 'A name is required',
        trim: true
    },
    date: {
        type: Date,
        required: 'A date is required',
        trim: true
    },
    location: {
        type: {
            x: {
                type: String,
                required: "An X axis is required"
            },
            y: {
                type: String,
                required: "An Y axis is required"
            }
        },
        required: 'A location is required'
    },
    tasksList: {
        type: [Task.schema.obj],
        default: []
    },
    guestsList: {
        type: [String],
        required: 'A guest list is required',
    },
    commentsList: {
        type: [Comment.schema.obj],
        default: []
    },
})

partySchema.plugin(uniqueValidator, { message: "Error, expected \"${PATH}\" ({VALUE}) to be unique."})
module.exports = mongoose.model("Party", partySchema);