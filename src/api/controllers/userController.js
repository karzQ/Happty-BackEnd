require('dotenv').config();
const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.get_all_users = async (req, res) => {
    try {
        User.find({}, (err, users) => {
            if (err) {
                throw 'Server internal error.';
            } else {
                console.log("Get all users : ", users);
                /* const newUserArr = [];

                users.forEach(user => {
                    const newObjUser = {
                        ...user,
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
                    newUserArr.push(newObjUser);
                });

                res.status(200);
                res.json(newUserArr); */
            }
        });
    } catch (err) {
        res.status(500);
        console.log(err);
        res.json({
            message: err
        });
    }
}


exports.get_user_by_id = async (req, res) => {
    try {
        User.findById(req.params.userId, (err, user) => {
            if (err) {
                throw 'Server internal error.';
            } else if (!user) {
                throw 'Ressource not found.';
            } else {
                console.log("Get user by ID : ", user);
            }
        })
    } catch(err) {
        res.status(500);
        res.json({
            message: err
        });
    }
}


exports.create_new_user = async (req, res) => {
    let statusCode = 201;

    const { firstname, lastname, pseudo, age, email, password, phone, profilePicturePath, notifications, uniqueCode } = req.body;

    // console.log(req.body)

    try {
        if (firstname && lastname && pseudo && email && password && phone) {
            const userObj = {
                firstname,
                lastname,
                pseudo,
                age: age ?? 0,
                email,
                password, 
                phone,
                profilePicturePath: profilePicturePath ?? '',
                notifications: notifications ?? [],
                uniqueCode: uniqueCode ?? ''
            };

            // L'opérateur ?? permet de tester si la valeur de gauche est "undefined" ou "null", et ainsi affecter la valeur de droite en fonction.
            // const b = myObject?.a ?? 1; Assigne la key [a] si elle existe sinon b sera égal à 1

            const newUser = new User(userObj);

            newUser.save((err, user) => {
                if (err) {
                    statusCode = 500;
                    throw err;
                } else {
                    res.status(statusCode)
                    .json(user);
                    console.log("User successfully created !", user);
                }
            });
        } else {
            throw 'All fields are required';
        }
    } catch (err) {
        res.status(statusCode);
        res.json({
            message: 'Server internal error ?'
        });
    }
}

exports.update_user = async (req, res) => {
    
}

exports.delete_user = async (req, res) => {

}

exports.get_user_by_pseudo = async (req, res) => {

}

exports.login_user = async (req, res) => {

}