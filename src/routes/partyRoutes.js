module.exports = (server) => {
    const partyController = require('../controllers/partyController');

    /**
     * @openapi
     * /parties:
     *   get:
     *     tags: [Parties]
     *     summary: Get all parties
     *     description: Get all parties in the collection
     *     responses:
     *       200:
     *         description: Return all parties.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties')
        .get(partyController.get_all_parties);

    /**
     * @openapi
     * /parties/{partyId}:
     *   get:
     *     tags: [Parties]
     *     summary: Get one user
     *     description: Get only one specific party for one . 
     *     responses:
     *       200:
     *         description: Return the user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/:partyId')
        .get(partyController.get_one_party);

    /**
     * @openapi
     * /parties/{partyId}/update:
     *   put:
     *     tags: [Parties]
     *     summary: Update a party
     *     description: Update a party.
     *     responses:
     *       201:
     *         description: Return the updated party.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/:partyId/update')
        .put(partyController.update_party);

    /**
     * @openapi
     * /parties/{partyId}/delete:
     *   delete:
     *     tags: [Parties]
     *     summary: Delete a party
     *     description: Delete a party.
     *     responses:
     *       201:
     *         description: Return the deleted party.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/:partyId/delete')
        .delete(partyController.delete_party);

    /**
     * @openapi
     * /parties/create:
     *   post:
     *     tags: [Parties]
     *     summary: Subscribe a party
     *     description: Subscription for a new party. 
     *     responses:
     *       201:
     *         description: Successfully created a new party.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/create')
        .post(partyController.create_party);
}