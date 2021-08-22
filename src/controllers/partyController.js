const { json_response, check_create_element, check_get_one, check_update } = require('../utils/utils');
const { verify_token } = require('../middlewares/jwtMiddleware');
const Party = require('../models/party');
const User = require('../models/user');
const { baseUrl: hostname, port } = require('./../config');

require('dotenv').config();


exports.get_one_party = (req, res) => {
    let statusCode = 200;
    const {partyId} = req.params

    try {
        check_get_one(req, 'partyId', () => {
            verify_token(req, res, false, async(payload) => {
                Party.find({_id: partyId, userId: payload.userId}, (err, party) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (party) {
                        let guestsArr = [];
                        if (party.guestsList.length > 0) {
                            User.find({_id: {
                                $in: party.guestsList
                            }}, (err, users) => {
                                if (err) {
                                    statusCode = 500;
                                    throw {type: 'server_error'};
                                } else if (users.length === 0) {
                                    statusCode = 404;
                                    throw {type: 'not_found', objName: 'Users'};
                                } else if (users.length > 0) {
                                    statusCode = 200;
                                    guestsArr = users;
                                } else {
                                    statusCode = 500;
                                    throw {type: 'error_occured'};
                                }
                            })
                        }

                        const obj = {
                            ...party._doc,
                            guestsList:  guestsArr.length > 0 ? guestsArr : [],
                            _options: {
                                get: {
                                    method: "GET",
                                    link: `http://${hostname}:${port}/parties/${party._id}`
                                },
                                update: {
                                    method: "PUT",
                                    link: `http://${hostname}:${port}/parties/${party._id}/update`,
                                    properties: {
                                        name: {
                                            type: 'String'
                                        },
                                        date: {
                                            type: 'String'
                                        },
                                        location: {
                                            type: 'Object',
                                            properties: {
                                                x: {
                                                    type: 'String'
                                                },
                                                y: {
                                                    type: 'String'
                                                },
                                            }
                                        },
                                        tasksList: {
                                            type: 'Array',
                                            properties: {
                                                id: {
                                                    type: 'String',
                                                },
                                                content: {
                                                    type: 'String',
                                                },
                                                stars: {
                                                    type: 'Number',
                                                    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
                                                }
                                            }
                                        },
                                        foodsList: {
                                            type: 'Array',
                                        },
                                        guestsList: {
                                            type: 'Array',
                                            info: 'userId list'
                                        },
                                        commentsList: {
                                            type: 'Array',
                                            info: 'Objects list',
                                            properties: {
                                                id: {
                                                    type: 'String',
                                                },
                                                content: {
                                                    type: 'String'
                                                },
                                                stars: {
                                                    type: 'Number',
                                                    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
                                                }
                                            }
                                        }
                                    }
                                },
                                delete: {
                                    method: "DELETE",
                                    link: `http://${hostname}:${port}/parties/${party._id}/delete`,
                                }
                            }
                        }

                        json_response(req, res, statusCode, {type: 'get_one', objName: "Party"}, {...obj});
                        return;
                        
                    } else {
                        statusCode = 500;
                        throw {type: 'error_occured'}
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}

exports.get_all_parties = (req, res) => {
    let statusCode = 200;

    try {
        verify_token(req, res, false, async (payload) => {
            Party.find({userId: payload.userId}, (err, parties) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};
                } else if (parties.length === 0) {
                    statusCode = 404;
                    json_response(req, res, statusCode, {type: 'not_found', objName: 'Party'}, null, true);
                    return;
                } else if (parties.length > 0) {
                    const partiesArr = [];
                    
                    parties.forEach(party => {
                        const partyObj = {
                            ...party._doc,
                            _options: {
                                get: {
                                    method: "GET",
                                    link: `http://${hostname}:${port}/parties/${party._id}`
                                },
                                update: {
                                    method: "PUT",
                                    link: `http://${hostname}:${port}/parties/${party._id}/update`,
                                    properties: {
                                        name: {
                                            type: 'String'
                                        },
                                        date: {
                                            type: 'String'
                                        },
                                        location: {
                                            type: 'Object',
                                            properties: {
                                                x: {
                                                    type: 'String'
                                                },
                                                y: {
                                                    type: 'String'
                                                },
                                            }
                                        },
                                        tasksList: {
                                            type: 'Array',
                                            properties: {
                                                id: {
                                                    type: 'String',
                                                },
                                                content: {
                                                    type: 'String',
                                                },
                                                stars: {
                                                    type: 'Number',
                                                    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
                                                }
                                            }
                                        },
                                        foodsList: {
                                            type: 'Array',
                                        },
                                        guestsList: {
                                            type: 'Array',
                                            info: 'userId list'
                                        },
                                        commentsList: {
                                            type: 'Array',
                                            info: 'Objects list',
                                            properties: {
                                                id: {
                                                    type: 'String',
                                                },
                                                content: {
                                                    type: 'String'
                                                },
                                                stars: {
                                                    type: 'Number',
                                                    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
                                                }
                                            }
                                        }
                                    }
                                },
                                delete: {
                                    method: "DELETE",
                                    link: `http://${hostname}:${port}/parties/${party._id}/delete`,
                                }
                            }
                        };

                        partiesArr.push({...partyObj});
                    });
                    
                    const obj = {
                        ...partiesArr,
                        _options: {
                            create: {
                                method: "POST",
                                link: `http://${hostname}:${port}/users/create`,
                                properties: {
                                    hostId: {
                                        type: 'String',
                                    },
                                    name: {
                                        type: 'String'
                                    },
                                    date: {
                                        type: 'String'
                                    },
                                    location: {
                                        type: 'Object',
                                        properties: {
                                            x: {
                                                type: 'String'
                                            },
                                            y: {
                                                type: 'String'
                                            },
                                        }
                                    },
                                    tasksList: {
                                        type: 'Array',
                                        info: 'Objects list',
                                        properties: {
                                            id: {
                                                type: 'String',
                                            },
                                            content: {
                                                type: 'String',
                                            },
                                            stars: {
                                                type: 'Number',
                                                enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
                                            }
                                        }
                                    },
                                    foodsList: {
                                        type: 'Array',
                                    },
                                    guestsList: {
                                        type: 'Array',
                                        info: "userId list"
                                    }
                                }
                            }
                        }
                    }
                    json_response(req, res, statusCode, {type: 'get_many', objName: 'Party'}, {...obj});
                    return;

                } else {
                    statusCode = 500;
                    throw {type: 'error_occured'};
                }
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}

exports.create_party = (req, res) => {
    let statusCode = 201;
    const {name, date, location, tasksList, guestsList} = req.body;

    try {
        verify_token(req, res, false, async (payload) => {
            check_create_element({...req.body, hostId: payload.userId}, Party, () => {
                let tasksArr = [];
                if (tasksList.length > 0) {
                    tasksList.forEach(task => {
                        delete task._doc._id;
                        tasksArr.push(new Task({
                            ...task._doc
                        }));
                        console.log({task});
                    })
                }

                User.find({_id: {
                    $in: guestsList
                }}, (err, users) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                        
                    } else if (users.length === 0) {
                        statusCode = 404;
                        throw {type: 'not_corresponding', objName: 'User'};

                    } else if (users.length > 0) {
                        
                        const newParty = new Party({
                            hostId: payload.userId,
                            name,
                            date: typeof date.getMonth === Date ? date : new Date(date),
                            location,
                            tasksList: tasksArr,
                            guestsList,
                        });
        
                        newParty.save((error, cParty) => {
                            if (error) {
                                console.log('test 1')
                                if (error.code === 11000) {
                                    statusCode = 500;
                                    json_response(req, res, statusCode, { type: 'already_exist_property', objName: Object.keys(error.keyValue)[0] }, null, true);
                                    return;
                                } else {
                                    statusCode = 500;
                                    json_response(req, res, statusCode, { type: 'server_error' }, null, true);
                                    return;
                                }
                            } else {
                                console.log('test 2')
                                const createdParty = { ...cParty._doc };
                                const data = {
                                    ...createdParty,
                                    _options: {
                                        get: {
                                            method: 'GET',
                                            link: `http://${hostname}:${port}/parties/${createdParty._id}`
                                        },
                                        update: {
                                            method: 'PATCH',
                                            link: `http://${hostname}:${port}/parties/${createdParty._id}/update`,
                                            properties: {
                                                name: {
                                                    type: 'String'
                                                },
                                                date: {
                                                    type: 'Date'
                                                },
                                                location: {
                                                    type : 'Object',
                                                    properties: {
                                                        x: 'String',
                                                        y: 'String'
                                                    }
                                                },
                                                tasksList: {
                                                    type: 'Array',
                                                    info: 'Objects list',
                                                    properties: {
                                                        type: {
                                                            type: 'String'
                                                        },
                                                        content: {
                                                            type: 'String'
                                                        },
                                                        assignedId: {
                                                            type: 'String'
                                                        },
                                                        isCompleted: {
                                                            type: 'Boolean'
                                                        }
                                                    }
                                                },
                                                guestsList: {
                                                    type: 'Array',
                                                    info: 'userId List'
                                                }
                                            }
                                        },
                                        delete: {
                                            method: 'DELETE',
                                            link: `http://${hostname}:${port}/parties/${createdParty._id}/delete`
                                        }
                                    }
                                }
        
                                json_response(req, res, statusCode, {type: 'success_create', objName: 'Party'}, data)
                                return;
                            }
                        });
                    } else {
                        statusCode = 500;
                        throw {type: 'error_occured'};
                    }
                });
            })
        });
    } catch (err) {
        json_response(req, res, statusCode, err, null, true)
        return;
    }
}

exports.update_party = (req, res) => {
    let statusCode = 201;
    const { partyId } = req.params;

    try {
        verify_token(req, res, false, async (payload) => {
            check_update(req, 'partyId', () => {
                Party.findOne({_id: partyId, hostId: payload.userId}, async (err, party) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (party) {
                        
                        const updatedParty = {
                            ...party._doc,
                            ...req.body
                        }

                        await Party.replaceOne(
                            {_id: partyId},
                            {...updatedParty}
                        );

                        const data = {
                            data: {...updatedParty},
                            previous: {...party._doc},
                            options: {
                                get: {
                                    method: 'GET',
                                    link: `http://${hostname}:${port}/parties/${createdParty._id}`
                                },
                                update: {
                                    method: 'PATCH',
                                    link: `http://${hostname}:${port}/parties/${createdParty._id}/update`,
                                    properties: {
                                        name: {
                                            type: 'String'
                                        },
                                        date: {
                                            type: 'Date'
                                        },
                                        location: {
                                            type : 'Object',
                                            properties: {
                                                x: 'String',
                                                y: 'String'
                                            }
                                        },
                                        tasksList: {
                                            type: 'Array',
                                            info: 'Objects list',
                                            properties: {
                                                type: {
                                                    type: 'String'
                                                },
                                                content: {
                                                    type: 'String'
                                                },
                                                assignedId: {
                                                    type: 'String'
                                                },
                                                isCompleted: {
                                                    type: 'Boolean'
                                                }
                                            }
                                        },
                                        guestsList: {
                                            type: 'Array',
                                            info: 'userId List'
                                        }
                                    }
                                },
                                delete: {
                                    method: 'DELETE',
                                    link: `http://${hostname}:${port}/parties/${createdParty._id}/delete`
                                }
                            }
                        }

                        json_response(req, res, statusCode, {type: 'success_update', objName: 'Party', value: `${updatedParty.name}`}, data)
                        return;

                    } else if (!party) {
                        statusCode = 404;
                        throw {type: 'not_found', objName: 'Party'};
                    } else {
                        statusCode = 500;
                        throw {type: 'error_occured'};
                    }
                });
            });
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}

exports.delete_party = (req, res) => {
    let statusCode = 209;
    const { partyId } = req.params;

    try {
        verify_token(req, res, false, (payload) => {
            Party.findOneAndDelete({_id: partyId, hostId: payload.userId}, (err, party) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};
                } else if (!party) {
                    statusCode = 404;
                    throw {type: 'not_found', objName: 'Party'};
                } else if (party) {
                    json_response(req, res, statusCode, {type: 'success_delete', objName: 'Party', value: party._id}, party);
                    return;
                } else {
                    statusCode = 500;
                    throw {type: 'error_occured'};
                }
            });
        });
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}