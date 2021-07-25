const { json_response, check_create_element, check_get_one } = require('../utils/utils');
const { verify_token } = require('../middlewares/jwtMiddleware');
const Party = require('../models/party');

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
                        
                    } else {
                        statusCode = 500;
                        throw {type: 'error_occured'}
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
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
                    throw {type: 'not_found', objName: 'Party'};
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
                    json_response(req, res, statusCode, {type: 'get_many', objName: 'Party'}, {...obj})

                } else {
                    statusCode = 500;
                    throw {type: 'error_occured'};
                }
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
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
                        }))

                        console.log({task})
                    })
                }
                
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
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else {
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

                        json_response(req, res, statusCode, {type: 'get_many', objName: 'Parties'}, {...data})
                    }
                });
            })
        });
    } catch (err) {
        json_response(req, res, statusCode, err, null, true)
    }
}

exports.update_party = (req, res) => {

}

exports.delete_party = (req, res) => {

}