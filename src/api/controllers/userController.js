require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;
const { port, baseUrl: hostname } = require('./../config');
const {
    json_response,
    check_update,
    check_get_one,
    check_create_element
} = require('../utils/utils');

exports.get_all_users = (req, res) => {
    let statusCode = 200;

    try {
        User.find({}, (err, users) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else {
                const usersList = [];

                users.forEach((user) => {
                    const newObjUser = {
                        _id: user._id,
                        email: user.email,
                        password: user.password,
                        link: `http://${hostname}:${port}/users/${user._id}`,
                    };
                    usersList.push({ ...newObjUser });
                });

                const obj = {
                    ...usersList,
                    _options: {
                        create: {
                            method: 'POST',
                            link: `http://${hostname}:${port}/users/create`,
                            properties: {
                                email: 'String',
                                password: 'String',
                                role: 'String',
                            },
                        },
                    },
                };
                json_response(
                    req,
                    res,
                    statusCode,
                    {type: 'get_many', objName: 'user', value: usersList.length},
                    obj
                );
            }
        });
    } catch (err) {
        console.log(err);
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.get_one_user = (req, res) => {
    let statusCode = 200;
    let error;

    try {
        check_get_one(req, 'userId', () => {
            User.findOne({ _id: req.params.userId }, (err, user) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};
                } else if (user) {
                    const data = {
                        ...user._doc,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/users/create`,
                                properties: {
                                    email: 'String',
                                    password: 'String',
                                    role: 'String',
                                },
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/users/${user._id}/update`,
                                properties: {
                                    email: 'String',
                                    password: 'String',
                                    role: 'String',
                                },
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${hostname}:${port}/users/${user._id}/delete`,
                            },
                        },
                    };
                    json_response(
                        req,
                        res,
                        statusCode,
                        {type: 'get_one', objName: 'User'},
                        data
                    );
                } else {
                    statusCode = 404;
                    throw {type: 'not_found', objName: 'User'}
                }
            });
        });
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.update_one_user = (req, res) => {
    let statusCode = 200;

    try {
        check_update(req, 'userId', () => {
            verify_token(req, res, false, async () => {
                User.findOne({ _id: req.params.userId }, async (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        const updatedUser = {
                            _id: user._id,
                            email: req.body?.email ?? user.email,
                            password: req.body?.password ?? user.password,
                            role: req.body?.role ?? user.role,
                        };
                        await User.replaceOne(
                            { _id: req.params.userId },
                            { ...updatedUser }
                        );

                        const data = {
                            beforeUpdate: {
                                user,
                            },
                            afterUpdate: {
                                updatedUser,
                            },
                            _options: {
                                create: {
                                    method: 'POST',
                                    link: `http://${hostname}:${port}/users/create`,
                                    properties: {
                                        email: 'String',
                                        password: 'String',
                                        role: 'String',
                                    },
                                },
                                update: {
                                    method: 'PUT',
                                    link: `http://${hostname}:${port}/users/${user._id}/update`,
                                    properties: {
                                        email: 'String',
                                        password: 'String',
                                        role: 'String',
                                    },
                                },
                                delete: {
                                    method: 'DELETE',
                                    link: `http://${hostname}:${port}/users/${user._id}/delete`,
                                },
                            },
                        };

                        json_response(
                            req,
                            res,
                            statusCode,
                            {type: 'update'},
                            data
                        );
                    } else {
                        statusCode = 404;
                        throw {type: 'not_found', objName: 'User'};
                    }
                });
            });
        });
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.delete_one_user = (req, res) => {
    let statusCode = 204;
    const userId = req.params.userId;

    try {
        if (userId) {
            verify_token(req, res, true, () => {
                User.findOneAndDelete({_id: userId}, (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        json_response(req, res, statusCode, {type: 'success_delete'}, user);
                    }
                })
            })
        } else {
            throw {type: 'id_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.login = (req, res) => {
    let statusCode = 202;

    try {
        const { email, password } = req.body;

        if (email && password) {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    statusCode = 401;
                    throw {type: 'email_pwd_couple_error'};
                } else if (user) {
                    if (req.body.password === user.password) {
                        jwt.sign(
                            { id: user._id, email: user.email, role: user.role },
                            JWT_TOKEN,
                            { expiresIn: '24 hours' },
                            async (err, token) => {
                                if (err) {
                                    statusCode = 500;
                                    throw {type: 'server_error'};
                                } else if (token) {
                                    const data = {
                                        token,
                                        role: user.role
                                    }
                                    json_response(req, res, statusCode, {type: 'success_login'}, data);
                                } else {
                                    statusCode = 400;
                                    throw {type: 'error_occured'};
                                }
                            }
                        );
                    } else {
                        statusCode = 400;
                        throw {type: 'email_pwd_couple_error'};
                    }
                } else {
                    statusCode = 404;
                    throw {type: 'email_not_exist'};
                }
            });
        } else {
            statusCode = 500;
            throw {type: 'fields_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.signup = async (req, res) => {
    let statusCode = 201;
    const { role, email, password } = req.body;
    try {
        check_create_element(req, User, () => {
            if (password === '' || password === null) {
                statusCode = 400;
                throw {type: 'password_required'}
            } else {
                User.findOne({ email }, async (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else {
                        const newUser = await new User({
                            role,
                            email: email.toLowerCase(),
                            password,
                        });

                        await newUser.save((error, cUser) => {
                            if (error) {
                                statusCode = 500;
                                json_response(req, res, statusCode, {type: 'server_error'}, null);
                            } else {
                                const createdUser = { ...cUser._doc };
                                delete createdUser.password;

                                const data = {
                                    ...createdUser,
                                    _options: {
                                        login: {
                                            method: 'POST',
                                            link: `http://${hostname}:${port}/login`,
                                            properties: {
                                                email: {
                                                    type: 'String',
                                                },
                                                password: {
                                                    type: 'String'
                                                }
                                            },
                                        },
                                    },
                                }
                                
                                json_response(req, res, statusCode, {type: 'success_create', objName: 'User'}, data);
                            }
                        });
                    }
                });
            }
        })
    } catch (err) {
        statusCode = 500;
        json_response(req, res, statusCode, 'POST', err, null, true);
    }
};
