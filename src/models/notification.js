const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    content: {
        type: String,
        required: 'A content is required',
        trim: true
    },
    userId: {
        type: String,
    },
    isNew: {
        type: Boolean,
        default: true,
        required: 'An isNew state is required'
    }
})

notificationSchema.plugin(uniqueValidator, { message: "Error, expected \"${PATH}\" ({VALUE}) to be unique."})
module.exports = mongoose.model("Notification", notificationSchema);