require('dotenv').config();
const validator = require('validator');
const bcrypt = require('bcrypt');
const Notification = require('../models/notificationModel');

exports.get_all_notification = async (req, res) => {
    try {
        Notification.find({}, (err, notifications) => {
            if (err) {
                throw 'Server internal error.';
            } else {
                console.log("List all notifications : ", notifications);
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


exports.get_a_notification = async (req, res) => {
    try {
        Notification.findById(req.params.notificationId, (err, notification) => {
            if (err) {
                throw 'Server internal error.';
            } else if (!notification) {
                throw 'Ressource not found.';
            } else {
                console.log("Notifications");
            }
        })
    } catch(err) {
        res.status(500);
        res.json({
            message: err
        });
    }
}



exports.create_notification = async (req, res) => {
    let statusCode = 201;

    const { name,message,created_at } = req.body;

    // console.log(req.body)

    try {
        if (name && message && created_at) {
            const notificationObj = {
               name,
               message,
               created_at
            };


            const newNotification = new Notification(notificationObj);

            newNotification.save((err, notification) => {
                if (err) {
                    statusCode = 500;
                    throw err;
                } else {
                    res.status(statusCode)
                    .json(notification);
                    console.log("Notification successfully created !", notification);
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

