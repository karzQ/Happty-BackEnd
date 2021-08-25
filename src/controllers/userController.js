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
    checkPhoneNumber,
    checkPasswordComplexity,
    checkEmail,
    checkSearchValue,
} = require('../utils/utils');


/* exports.get_all_users = (req, res) => {
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
                                    firstname: {
                                        type: 'String'
                                    },
                                    lastname: {
                                        type: 'String'
                                    },
                                    username: {
                                        type: 'String'
                                    },
                                    age: {
                                        type: 'Number'
                                    },
                                    email: {
                                        type: 'String'
                                    },
                                    password: {
                                        type: 'String'
                                    },
                                    profileImage: {
                                        type: 'String'
                                    },
                                    phone: {
                                        type: 'Number'
                                    },
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
                                firstname: {
                                    type: 'String'
                                },
                                lastname: {
                                    type: 'String'
                                },
                                username: {
                                    type: 'String'
                                },
                                age: {
                                    type: 'Number'
                                },
                                email: {
                                    type: 'String'
                                },
                                password: {
                                    type: 'String'
                                },
                                profileImage: {
                                    type: 'String'
                                },
                                phone: {
                                    type: 'Number'
                                },
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
                return;
            }
        });
    } catch (err) {
        console.log(err);
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}; */

exports.get_users_by_properties = (req, res) => {
    let statusCode = 200;
    const {searchValue} = req.params;
    const value = decodeURI(searchValue);

    console.log({searchValue})
    console.log({value})

    try {
        const property = checkSearchValue(value);
        User.find({[property]: value}, (err, users) => {
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
                                    firstname: {
                                        type: 'String'
                                    },
                                    lastname: {
                                        type: 'String'
                                    },
                                    username: {
                                        type: 'String'
                                    },
                                    age: {
                                        type: 'Number'
                                    },
                                    email: {
                                        type: 'String'
                                    },
                                    password: {
                                        type: 'String'
                                    },
                                    profileImage: {
                                        type: 'String'
                                    },
                                    phone: {
                                        type: 'Number'
                                    },
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
                                firstname: {
                                    type: 'String'
                                },
                                lastname: {
                                    type: 'String'
                                },
                                username: {
                                    type: 'String'
                                },
                                age: {
                                    type: 'Number'
                                },
                                email: {
                                    type: 'String'
                                },
                                password: {
                                    type: 'String'
                                },
                                profileImage: {
                                    type: 'String'
                                },
                                phone: {
                                    type: 'Number'
                                },
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
                return;
            }
        });
    } catch (err) {
        console.log(err);
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

exports.get_current_user = async (req, res) => {
    let statusCode = 200;
    try {
        verify_token(req, res, false, async (payload) => {
            if (payload.userId && payload.userId.length === 24) {
                User.findOne({ _id: payload.userId}, (err, user) => {
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
                                        firstname: {
                                            type: 'String'
                                        },
                                        lastname: {
                                            type: 'String'
                                        },
                                        username: {
                                            type: 'String'
                                        },
                                        age: {
                                            type: 'Number'
                                        },
                                        email: {
                                            type: 'String'
                                        },
                                        password: {
                                            type: 'String'
                                        },
                                        profileImage: {
                                            type: 'String'
                                        },
                                        phone: {
                                            type: 'Number'
                                        },
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
                                        firstname: {
                                            type: 'String'
                                        },
                                        lastname: {
                                            type: 'String'
                                        },
                                        username: {
                                            type: 'String'
                                        },
                                        age: {
                                            type: 'Number'
                                        },
                                        email: {
                                            type: 'String'
                                        },
                                        password: {
                                            type: 'String'
                                        },
                                        profileImage: {
                                            type: 'String'
                                        },
                                        phone: {
                                            type: 'Number'
                                        },
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
                        return;
                    } else {
                        statusCode = 404;
                        json_response(req, res, statusCode, {type: 'not_found', objName: 'User'}, null, true);
                        return;
                    }
                });
            } else {
                statusCode = 500;
                json_response(req, res, statusCode, {type: 'wrong_id_format'}, null, true);
                return;
            }
        });
    } catch (err) {
        console.log({err})
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

// exports.get_users_by_properties = (req, res) => {
//     let statusCode = 200;
//     // console.log({req})
//     try {
//         check_get_one(req, 'userId', () => {
//             User.findOne({ _id: req.params.userId }, (err, user) => {
//                 if (err) {
//                     statusCode = 500;
//                     throw {type: 'server_error'};
//                 } else if (user) {
//                     const data = {
//                        ...user._doc,
//                         _options: {
//                             create: {
//                                 method: 'POST',
//                                 link: `http://${hostname}:${port}/users/create`,
//                                 properties: {
//                                     role: {
//                                         type: 'Enum',
//                                         values: [
//                                             'user',
//                                             'admin'
//                                         ]
//                                     },
//                                     firstname: {
//                                         type: 'String'
//                                     },
//                                     lastname: {
//                                         type: 'String'
//                                     },
//                                     username: {
//                                         type: 'String'
//                                     },
//                                     age: {
//                                         type: 'Number'
//                                     },
//                                     email: {
//                                         type: 'String'
//                                     },
//                                     password: {
//                                         type: 'String'
//                                     },
//                                     profileImage: {
//                                         type: 'String'
//                                     },
//                                     phone: {
//                                         type: 'Number'
//                                     },
//                                 },
//                             },
//                             update: {
//                                 method: 'PUT',
//                                 link: `http://${hostname}:${port}/users/${user._id}/update`,
//                                 properties: {
//                                     role: {
//                                         type: 'Enum',
//                                         values: [
//                                             'user',
//                                             'admin'
//                                         ]
//                                     },
//                                     firstname: {
//                                         type: 'String'
//                                     },
//                                     lastname: {
//                                         type: 'String'
//                                     },
//                                     username: {
//                                         type: 'String'
//                                     },
//                                     age: {
//                                         type: 'Number'
//                                     },
//                                     email: {
//                                         type: 'String'
//                                     },
//                                     password: {
//                                         type: 'String'
//                                     },
//                                     profileImage: {
//                                         type: 'String'
//                                     },
//                                     phone: {
//                                         type: 'Number'
//                                     },
//                                 },
//                             },
//                             delete: {
//                                 method: 'DELETE',
//                                 link: `http://${hostname}:${port}/users/${user._id}/delete`,
//                             },
//                         },
//                     };
//                     json_response(
//                         req,
//                         res,
//                         statusCode,
//                         {type: 'get_one', objName: 'User'},
//                         data
//                     );
//                 } else {
//                     statusCode = 404;
//                     throw {type: 'not_found', objName: 'User'}
//                 }
//             });
//         });
//     } catch (err) {
//         json_response(req, res, statusCode, err, null, true);
//     }
// };

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
                        let password = req.body?.password ?? user.password;
                        let email = req.body?.email ?? user.email;
                        let phone = req.body?.phone ?? user.phone;

                        if (password === req.body?.password) {
                            password = await checkPasswordComplexity(req.body.password).catch(e => {
                                statusCode = 500;
                                json_response(req, res, statusCode, e, null, true);
                                return;
                            });
                            
                            password = await bcrypt.hash(password, 10);
                        }

                        if (email === req.body.email) {
                            email = await checkEmail(req.body.email.toLowerCase()).catch(e => {
                                statusCode = 500;
                                json_response(req, res, statusCode, e, null, true);
                                return;
                            });
                        }

                        if (phone === req.body.phone) {
                            phone = await checkPhoneNumber(req.body.phone).catch(e => {
                                statusCode = 500;
                                json_response(req, res, statusCode, e, null, true);
                                return;
                            })
                        }

                        const updatedUser = {
                            ...user._doc,
                            role: req.body?.role ?? user.role,
                            firstname: req.body?.firstname ? capitalize(req.body.firstname) : user.firstname,
                            lastname: req.body?.lastname ? req.body.lastname.toUpperCase() : user.lastname.toUpperCase(),
                            username: req.body?.username ? changeUsername(req.body?.username, user.username) : user.username,
                            age: req.body?.age ?? user.age,
                            email,
                            password,
                            phone,
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
                                        firstname: {
                                            type: 'String'
                                        },
                                        lastname: {
                                            type: 'String'
                                        },
                                        username: {
                                            type: 'String'
                                        },
                                        age: {
                                            type: 'Number'
                                        },
                                        email: {
                                            type: 'String'
                                        },
                                        password: {
                                            type: 'String'
                                        },
                                        profileImage: {
                                            type: 'String'
                                        },
                                        phone: {
                                            type: 'Number'
                                        },
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
                                        firstname: {
                                            type: 'String'
                                        },
                                        lastname: {
                                            type: 'String'
                                        },
                                        username: {
                                            type: 'String'
                                        },
                                        age: {
                                            type: 'Number'
                                        },
                                        email: {
                                            type: 'String'
                                        },
                                        password: {
                                            type: 'String'
                                        },
                                        profileImage: {
                                            type: 'String'
                                        },
                                        phone: {
                                            type: 'Number'
                                        },
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
                        await json_response(req, res, statusCode, {type: 'success_delete', objName: 'User', value: user._id}, null);
                        return;
                    } else if (!user) {
                        statusCode = 404;
                        json_response(req, res, statusCode, {type: 'not_found', objName: 'User'}, null, true);
                        return;
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
        return;
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
                console.log({err})
                console.log({user})
                if (err) {
                    statusCode = 500;
                    json_response(req, res, statusCode, {type: "server_error"}, null, true);

                } else if (!user || user === null) {
                    statusCode = 401;
                    json_response(req, res, statusCode, {type: "invalid_email"}, null, true);

                } else if (user) {
                    const isDecryptedPassword = await decryptPassword(req.body.password, user.password);
                    console.log({isDecryptedPassword})
                    if (isDecryptedPassword === true) {
                        jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_TOKEN, { expiresIn: '24 hours' }, async (err, token) => {
                                if (err) {
                                    statusCode = 500;
                                    json_response(req, res, statusCode, {type: "server_error"}, null, true);
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
                        json_response(req, res, statusCode, {type: "email_pwd_couple_error"}, null, true);
                    }
                } else {
                    statusCode = 500;
                    json_response(req, res, statusCode, {type: "server_error"}, null, true);
                }
            })
        } else {
            statusCode = 500;
            json_response(req, res, statusCode, {type: "fields_required"}, null, true);
        }
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
};

exports.signup = async (req, res) => {
    let statusCode = 201;
    const { role, firstname, lastname, username, age, profileImage } = req.body;
    try {
        check_create_element({...req.body}, User, async () => {
            const password = await checkPasswordComplexity(req.body.password).catch(e => {
                statusCode = 409;
                console.log({e})
                json_response(req, res, statusCode, e, null, true);
                return;
            });

            const email = await checkEmail(req.body.email.toLowerCase()).catch(e => {
                statusCode = 409;
                console.log({e})
                json_response(req, res, statusCode, e, null, true);
                return;
            });

            const phone = await checkPhoneNumber(req.body.phone).catch(e => {
                statusCode = 409;
                console.log({e})
                json_response(req, res, statusCode, e, null, true);
                return;
            })
            
            if (password !== undefined && email !== undefined && phone !== undefined) {
                const hashedPassword = await bcrypt.hash(await password, 10);
                User.findOne({ email }, async (err, user) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (user) {
                        statusCode = 422;
                        json_response(req, res, statusCode, {type: 'exist', objName: 'User' }, null);
                        return;
                    } else {
                        
                        const newUser = await new User({
                            role,
                            email,
                            firstname: capitalize(firstname),
                            lastname: lastname.toUpperCase(),
                            username: formatUsername(username, getDocumentsCount(User)),
                            age: age ?? 0,
                            password: hashedPassword,
                            phone,
                            profileImage: profileImage ?? '',
                            // accessCode: await uniqueCode
                        });

                        console.log({newUser})
                        
                        newUser.save((error, cUser) => {
                            if (error) {
                                if (error.code === 11000) {
                                    statusCode = 409;
                                    json_response(req, res, statusCode, { type: 'already_exist_property', objName: Object.keys(error.keyValue)[0] }, null, true);
                                    return;
                                } else {
                                    statusCode = 500;
                                    json_response(req, res, statusCode, { type: 'server_error' }, null, true);
                                    return;
                                }
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
                                        get: {
                                            method: 'GET',
                                            link: `http://${hostname}:${port}/users/${createdUser._id}`
                                        },
                                        update: {
                                            method: 'PUT',
                                            link: `http://${hostname}:${port}/users/${createdUser._id}/update`,
                                            properties: {
                                                firstname: {
                                                    type: 'String'
                                                },
                                                lastname: {
                                                    type: 'String'
                                                },
                                                username: {
                                                    type: 'String'
                                                },
                                                age: {
                                                    type: 'Number'
                                                },
                                                email: {
                                                    type: 'String'
                                                },
                                                password: {
                                                    type: 'String'
                                                },
                                                profileImage: {
                                                    type: 'String'
                                                },
                                                phone: {
                                                    type: 'Number'
                                                },
                                            },
                                        },
                                        delete: {
                                            method: 'DELETE',
                                            link: `http://${hostname}:${port}/users/${createdUser._id}/delete`
                                        }
                                    }
                                };
                                json_response(req, res, statusCode, { type: 'success_create', objName: 'User' }, data);
                                return;
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log({err})
        json_response(req, res, statusCode, 'POST', err, null, true);
        return;
    }
};
