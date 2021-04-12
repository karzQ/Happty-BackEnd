require('dotenv').config();
const Party = require('../models/partyModel');

exports.create_a_party = (req, res) => {
    let new_party = new Party(req.body);

    new_party.save((error, party) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({
                message: "Erreur serveur."
            })
        } else {
            res.status(201);
            res.json({
                message: `Party créée : ${party.name}`
            })
        }
    })
}
