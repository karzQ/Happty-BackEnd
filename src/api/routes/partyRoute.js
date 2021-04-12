module.exports = (server) => {
    const partyController = require("../controllers/partyController");

     /**
     * Route to get all parties or create a new one.
     * @name get/post/parties
     * @memberof module:routers/partyRoute
     * @param {string} path - Express path.
     * @param {Object} req.body - The JSON payload (for POST only).
     */ 
    server
        .route("/parties")
            .get(partyController.get_all_party)
            .post(partyController.create_new_party);

    /**
     * Route to get, update or delete a specific party by its id.
     * @name get/post/parties/partyId
     * @memberof module:routers/partyRoute
     * @param {string} path - Express path.
     * @param {string} partyId - Id of the party.
     * @param {Object} req.body - The JSON payload (for PUT only).
     */ 
    server
        .route("/parties/:partyId")
            .get(partyController.get_a_party_by_id)
            .put(partyController.update_a_party)
            .delete(partyController.delete_a_party);

    /**
     * Route to get all the parties of a user by its id.
     * @name get/parties/users/:userId
     * @memberof module:routers/partyRoute
     * @param {string} path - Express path.
     * @param {string} userId - Id of the user.
     * @param {boolean} host - Query parameter (path?host=true) to specify if you want to get all the user's parties or only the parties where the user is the host.
     */ 
    server
        .route("parties/users/:userId")
            .get(partyController.get_all_user_parties);
}