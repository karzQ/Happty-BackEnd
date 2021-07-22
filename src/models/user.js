const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: [
            'user',
            'admin'
        ]
    },
    password: {
        type: String,
        required: 'A password is required',
        trim: true
    },
    email: {
        type: String,
        required: 'An email is required',
        unique: true,
        trim: true
    },
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

    username: {
        type: String,
        required: 'Username is required',
        unique: true,
        trim: true
    },

    age: {
        type: Number
    },

    phone: {
        type: String,
        required: "Phone number is required",
    },

    profilPicturePath: {
        type: String,
        trim: true
    },

    accessCode: {
        type: String,
    }
})

userSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("User", userSchema);