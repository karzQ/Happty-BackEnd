const { validate } = require('../models/partyModel');
const Party = require('../models/partyModel');
const partyValidator = require('../utils/partyValidator')
const mongoose = require('mongoose')

exports.get_all_party =(req,res) => {
    Party.find({},(error,docs) => {
        if(error){
            return res.status(500).json({message:"Internal server error"})          
        }
        return res.json(docs)    
    })
}

exports.get_a_party_by_id = (req,res) => {
    const id = req.params.partyId
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({message: "Invalid objectId"})
    }
    else{
        Party.findById(id,(error,docs) => {
            if(error){
                return res.status(500).json({message:"Internal server error"})          
            }
            if(!docs){
                return res.status(404).json({message: "Party not found"})
            }
            return res.json(docs)    
        })
    }
}

exports.update_a_party = async (req,res) => {
    const partyId = req.params.partyId;
    const data = req.body;

    try {
      const isExistParty = await Party.findById(partyId);
      if (!isExistParty) {
        return res.status(404).send({ message: "Party not found" });
      }

      const isExistName = await Party.findOne({
        name: data.name,
        _id: { $ne: partyId },
      });

      if (isExistName) {
        return res.status(409).send({ message: "Name already taken" });
      }

      const party = await Party.findOneAndUpdate({ _id: partyId }, { $set: data },{new:true});

      return res.send({ message: "Party updated", party });
    } catch (error) {
      //console.error(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;", error);
      return res.status(500).send({ message: "Internal server error" });
    }

}

exports.delete_a_party = async (req,res) => {
    const partyId = req.params.partyId;
    try {
      const isExistParty = await Party.findById(partyId);
      if (!isExistParty) {
        return res.status(404).send({ message: "Party not found" });
      }
      await Party.findByIdAndDelete(partyId);
      return res.send({ 
          message: "Party deleted",
          partyId

     });
    } catch (error) {
      ///console.error(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  
    

}

exports.get_all_user_parties = (req,res) => {
    
    return res.send("Update a party")

}


exports.create_new_party = (req, res) => {
    let userId = res.locals.token.userId;
    console.log(userId);
    const {error} = partyValidator.validate(req.body)
    if(error.message){
        return res.status(400).json({message: error.message})

    }

    let new_party = new Party({
        ...req.body,userId});

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
                message: `Party créée : ${party.name}`,
                party: new_party
            })
        }
    })
}
