const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new Schema({
    name: {
        type: String,
        required: "Name is required",
        trim: true
    },

    date: {
        type: Date,
        required: "Date is required"
        
    },

    location: {
        type: String,
        required: "Location is required",
        trim: true
    },

});

/**
 * Send User object to User collection in MongoDB.
 */ 
module.exports = mongoose.model("Party", partySchema);