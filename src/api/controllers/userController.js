require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const validator = require("validator");
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;

const {capitalize, decryptPassword, formatPseudo, getDocumentsCount} = require("../utils/utils");

exports.get_all_users = async (req, res) => {
    let statusCode = 200;
    
    try {
        User.find({}, (err, users) => {
            if (err) {
                throw 'Server internal error.';
            } else {
                const newUserArr = [];

                users.forEach(user => {
                    const newObjUser = {
                        _id : user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        pseudo: user.pseudo,
                        email: user.email,
                        password: user.password,
                        age: user.age,
                        phone: user.phone,
                        notifications: user.notifications,
                        profilePicturePath: user.profilePicturePath
                    }
                    newUserArr.push({...newObjUser});
                });

                res.status(statusCode).json({
                    code: statusCode,
                    message: "Users found",
                    users: newUserArr
                });
            }
        });
    } catch (err) {
        res.status(500);
        console.log(err);
        res.json({
            code: statusCode,
            message: err
        });
    }
}

exports.get_user_by_id = async (req, res) => {
    let statusCode = 200;
    try {
        User.find({_id: req.params.id}, (err, user) => {
            if (err) {
                statusCode = 500
                throw "User not found."
            } else {
                console.log("User exist")
                res.status(statusCode)
                .json({
                    message: "User found",
                    user
                })
            }
        })
    } catch (err) {
        console.log("User not exist")
        res.json({
            message: err
        })
    }
}

exports.create_new_user = async (req, res) => {
    let statusCode = 201;
    const { firstname, lastname, pseudo, age, email, password, phone, profilePicturePath, notifications, uniqueCode } = req.body;
    
    try {
        if (firstname && lastname && pseudo && email && password && phone) {
            if (!validator.isEmail(email)) {
                statusCode = 400;
                throw "Email don't have the right format.";
            } else if (password === "" || password === null) {
                throw "You have to set a password"
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                User.findOne({email, pseudo, phone}, async (err, user) => {
                    if (err) {
                        throw err;
                    } else {
                        const newUser = await new User({
                            firstname: capitalize(firstname),
                            lastname: capitalize(lastname),
                            pseudo: formatPseudo(pseudo, await getDocumentsCount(User)),
                            age: age ?? 0,
                            email,
                            password: hashedPassword, 
                            phone,
                            profilePicturePath: profilePicturePath ?? '',
                            notifications: notifications ?? [],
                            uniqueCode: uniqueCode ?? ''
                        });
                        
                        newUser.save((error, data) => {
                            if (error) {
                                statusCode = 500;
                                res.status(statusCode)
                                .json({
                                    message: "Server internal error",
                                    user: null
                                })
                            } else {
                                console.log("User has been saved")
                                const createdUser = {...data._doc};
                                delete createdUser.password;
                                res.status(statusCode)
                                .json({
                                    message: "User successfully created",
                                    user: createdUser
                                })
                            }
                        })
                    }
                })
            }            
        } else {
            throw "All fields are required"
        }

    } catch (err) {
        statusCode = 500;
        console.log("[Error]")
        res.status(statusCode)
        .json({
            message: err,
            user: null
        })
    }
}

exports.update_user = async (req, res) => {
    let statusCode = 201;

    try {
        const userId = req.params.userId;

        if (userId) {
            const updatedUser = await User.findOneAndUpdate({_id: userId}, req.body, {
                upsert: false,
                new: true,
                returnOriginal: false,
            });

            if (updatedUser) {
                console.log("User successfully updated")
                res.status(statusCode)
                .json({
                    message: `User ${updatedUser._id} has been successfully updated`,
                    user: updatedUser
                });
            } else {
                throw "An error has occurred while updating user";
            }
        } else {
            throw "Id is required ";
        }
    } catch (err) {
        statusCode = 500;
        res.status(statusCode)
        .json({
            message: err,
            user: null
        });
    }
}

exports.delete_user = async (req, res) => {
    let statusCode = 201;

    try {
        const userId = req.params.userId;

        if (userId) {
            User.findOneAndDelete({_id: userId}, (err, user) => {
                if (err) {
                    console.log("An error has occurred");
                    throw err;
                    
                } else if (user) {
                    console.log("User deleted");
                    res.status(statusCode)
                    .json({
                        message: "User successfully deleted",
                        user
                    })
                } else {
                    statusCode = 400;
                    console.log("User not found");
                    res.status(statusCode)
                    .json({
                        message: "User not found",
                        user: null
                    })
                }
            })
        }
    } catch (err) {
        statusCode = 500;
        res.status(statusCode)
        .json({
            message: err,
            user: null
        })
    }
}

exports.login_user = async (req, res) => {
    let statusCode = 200;

    try {
        const { email, password } = req.body;

        if (email && password) {
            User.findOne({email}, (err, user) => {
                if (err) {
                    throw "Invalid Email and/or password"
                } else if (user) {
                    if (decryptPassword(req.body.password, user.password)) {
                        jwt.sign({email: user.email, role: "user"}, JWT_TOKEN, {expiresIn: "1 hour"}, (err, token) => {
                            if (err) {
                                console.log({err})
                                statusCode = 500;
                                throw "Internal server error";
                            } else if (token) {
                                console.log("Successfully logged")
                                res.status(statusCode)
                                .json({
                                    token
                                })
                            } else {
                                throw "An error has occured"
                            }
                        });
                    } else {
                        throw "The couple Email/Password is not working"
                    }
                } else {
                    statusCode = 400;
                    throw "Email not exist"
                }
            });
        } else {
            statusCode = 500;
            throw "All fields are required"
        }
       
    } catch (err) {
        res.status(statusCode)
        .json({
            message: err
        })
    }
}

exports.get_user_by_pseudo = async (req, res) => {
    
}
