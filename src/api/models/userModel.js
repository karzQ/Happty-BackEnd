const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: "FirstName is required",
        trim: true
    },

    lastname: {
        type: String,
        required: "LastName is required",
        trim: true
    },

    pseudo: {
        type: String,
        required: 'Pseudo is required',
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: "Email is required",
        unique: true
    },

    password: {
        type: String,
        required: "Password is required",
        trim: true
    },

    age: {
        type: Number
    },

    phone: {
        type: String,
        required: "Phone number is required",
        unique: true,
        trim: true
    },

    profilPicturePath: {
        type: String,
        trim: true
    },

    notifications: {
        type: [Object],
    },

    uniqueCode: {
        type: String,
    }
});


userSchema.plugin(uniqueValidator, {message: "Error, expected \"{PATH}\" ({VALUE}) to be unique"})

/**
 * Send User object to User collection in MongoDB.
 */ 
 module.exports = mongoose.model("User", userSchema);
