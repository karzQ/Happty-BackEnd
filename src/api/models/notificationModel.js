const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    name: {
        type: String,
        required: "Name is required",
        trim: true
    },

    message: {
        type: String,
        required: "Message is required"
        
    },
    created_at: {
        type: Date,
        default: Date.now
    },

});

/**
 * Send User object to User collection in MongoDB.
 */ 
module.exports = mongoose.model("Notification", notificationSchema);