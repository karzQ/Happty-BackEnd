const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    }
})

commentSchema.plugin(uniqueValidator, { message: "Error, expected \"${PATH}\" ({VALUE}) to be unique."})
module.exports = mongoose.model("Comment", commentSchema);