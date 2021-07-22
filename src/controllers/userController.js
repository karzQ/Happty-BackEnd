require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const JWT_TOKEN = process.env.JWT_TOKEN;
const { verify_token } = require('./../middlewares/jwtMiddleware');
const { port, baseUrl: hostname } = require('./../config');
const {
    getDocumentsCount,
    capitalize,
    formatUsername,
    changeUsername,
    decryptPassword,
    json_response,
    check_update,
    check_get_one,
    check_create_element,
    generateAccessCode,
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
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        _options: {
                            get: {
                                method: 'GET',
                                link: `http://${hostname}:${port}/users/${user._id}`,
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/users/${user._id}/update`,
                                properties: {
                                    role: {
                                        type: 'Enum',
                                        values: [
                                            'user',
                                            'admin'
                                        ]
                                    },
                                    firstname: 'String',
                                    lastname: 'String',
                                    username: 'String',
                                    age: 'Number',
                                    email: 'String',
                                    password: 'String',
                                    phone: 'Number',
                                },
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${hostname}:${port}/users/${user._id}/delete`,
                            },
                        },
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
                                role: {
                                    type: 'Enum',
                                    values: [
                                        'user',
                                        'admin'
                                    ]
                                },
                                firstname: 'String',
                                lastname: 'String',
                                username: 'String',
                                age: 'Number',
                                email: 'String',
                                password: 'String',
                                phone: 'Number',
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
                                    role: {
                                        type: 'Enum',
                                        values: [
                                            'user',
                                            'admin'
                                        ]
                                    },
                                    firstname: 'String',
                                    lastname: 'String',
                                    username: 'String',
                                    age: 'Number',
                                    email: 'String',
                                    password: 'String',
                                    phone: 'Number',
                                },
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/users/${user._id}/update`,
                                properties: {
                                    role: {
                                        type: 'Enum',
                                        values: [
                                            'user',
                                            'admin'
                                        ]
                                    },
                                    firstname: 'String',
                                    lastname: 'String',
                                    username: 'String',
                                    age: 'Number',
                                    email: 'String',
                                    password: 'String',
                                    phone: 'Number',
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
                            role: req.body?.role ?? user.role,
                            firstname: req.body?.firstname ? capitalize(req.body.firstname) : user.firstname,
                            lastname: req.body?.lastname ? capitalize(req.body.lastname) : user.lastname,
                            username: req.body?.username ? changeUsername(req.body?.username, user.username) : user.username,
                            age: req.body?.age ?? user.age,
                            email: req.body?.email ?? user.email,
                            password: req.body?.password ?? user.password,
                            phone: req.body?.phone ?? user.phone,
                        };
                        await User.replaceOne(
                            { _id: req.params.userId },
                            { ...updatedUser }
                        );

                        delete user._doc.password
                        delete updatedUser.password

                        const data = {
                            data: {...updatedUser},
                            previous: {...user._doc},
                            _options: {
                                create: {
                                    method: 'POST',
                                    link: `http://${hostname}:${port}/users/create`,
                                    properties: {
                                        role: {
                                            type: 'Enum',
                                            values: [
                                                'user',
                                                'admin'
                                            ]
                                        },
                                        firstname: 'String',
                                        lastname: 'String',
                                        username: 'String',
                                        age: 'Number',
                                        email: 'String',
                                        password: 'String',
                                        phone: 'Number',
                                    },
                                },
                                update: {
                                    method: 'PUT',
                                    link: `http://${hostname}:${port}/users/${user._id}/update`,
                                    properties: {
                                        role: {
                                            type: 'Enum',
                                            values: [
                                                'user',
                                                'admin'
                                            ]
                                        },
                                        firstname: 'String',
                                        lastname: 'String',
                                        username: 'String',
                                        age: 'Number',
                                        email: 'String',
                                        password: 'String',
                                        phone: 'Number',
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
                        return;
                    } else {
                        statusCode = 404;
                        throw {type: 'not_found', objName: 'User'};
                    }
                });
            });
        });
    } catch (err) {
        console.log({err});
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

exports.delete_self = (req, res) => {
    let statusCode = 201;
    const userId = req.params.userId;

    try {
        if (userId) {
            verify_token(req, res, false, async (payload) => {
                await User.findOneAndDelete({_id: payload.userId}, async (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        await json_response(req, res, statusCode, {type: 'success_delete', objName: 'User', value: user._id}, user);
                    } else if (!user) {
                        statusCode = 404;
                        json_response(req, res, statusCode, {type: 'not_found', objName: 'User'}, null, true);
                    } else {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    }
                })
            })
        } else {
            statusCode = 400;
            throw {type: 'id_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
    }
};

exports.delete_user_admin = async (req, res) => {
    let statusCode = 201;
    const userId = req.params.userId;

    try {
        if (userId) {
            verify_token(req, res, true, async () => {
                User.findOneAndDelete({_id: userId}, (err, user) => {
                    console.log({err})
                    console.log({user})
                    if (err) {
                        console.log({err})
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        json_response(req, res, statusCode, {type: 'success_delete'}, user);
                        return;
                    }
                })
            })
        } else {
            throw {type: 'id_required'};
        }
    } catch (err) {
        console.log({err})
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

exports.login = async (req, res) => {
    let statusCode = 202;

    try {
        const { email, password } = req.body;

        if (email && password) {
            await User.findOne({email}, async (err, user) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};

                } else if (!user) {
                    statusCode = 401;
                    throw {type: 'invalid_email'};

                } else if (user) {
                    const isDecryptedPassword = await decryptPassword(req.body.password, user.password);
                    if (isDecryptedPassword === true) {
                        jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_TOKEN, { expiresIn: '24 hours' }, async (err, token) => {
                                if (err) {
                                    statusCode = 500;
                                    throw {type: 'server_error'};
                                } else if (token) {
                                    const data = {
                                        token,
                                        role: user.role
                                    }
                                    json_response(req, res, statusCode, {type: 'success_login'}, data);
                                    return;
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
                    statusCode = 500;
                    throw {type: 'server_error'};
                }
            })
        } else {
            statusCode = 500;
            throw {type: 'fields_required'};
        }
    } catch (err) {
        console.log({err})
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

exports.signup = async (req, res) => {
    let statusCode = 201;
    const { role, firstname, lastname, username, age, email, password, phone, profilePicturePath } = req.body;
    try {
        check_create_element(req, User, async () => {
            if (!validator.isEmail(email)) {
                statusCode = 400;
                throw {type: 'email_wrong_format'};
            }
            else if (password === '' || password === null) {
                statusCode = 400;
                throw {type: 'password_required'}
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.findOne({ email }, async (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        statusCode = 422;
                        json_response(req, res, statusCode, {type: 'exist', objName: 'User' }, null);
                    } else {

                        // const uniqueCode = await generateAccessCode(User);

                        const newUser = await new User({
                            role,
                            email: email.toLowerCase(),
                            firstname: capitalize(firstname),
                            lastname: capitalize(lastname),
                            username: formatUsername(username, getDocumentsCount(User)),
                            age: age ?? 0,
                            password: hashedPassword,
                            phone,
                            profilePicturePath: profilePicturePath ?? '',
                            // accessCode: await uniqueCode
                        });

                        console.log({newUser})
                        
                        newUser.save((error, cUser) => {
                            if (error) {
                                statusCode = 500;
                                throw { type: 'server_error' };
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
                                        get_one: {
                                            method: 'GET',
                                            link: `http://${hostname}:${port}/users/${createdUser._id}`,
                                            properties: {
                                                email: {
                                                    type: 'String',
                                                },
                                                password: {
                                                    type: 'String'
                                                }
                                            },
                                        }
                                    }
                                };
                                json_response(req, res, statusCode, { type: 'success_create', objName: 'User' }, data);
                            }
                        });
                    }
                });
            }
        })
    } catch (err) {
        json_response(req, res, statusCode, 'POST', err, null, true);
    }
};
