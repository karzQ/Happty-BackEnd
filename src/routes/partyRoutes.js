module.exports = (server) => {
    const partyController = require('../controllers/partyController');

    /**
     * @openapi
     * /users:
     *   get:
     *     tags: [Parties]
     *     summary: Get all users
     *     description: Get all users in the collection
     *     responses:
     *       200:
     *         description: Return all users.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties')
        .get(partyController.get_all_parties);

    /**
     * @openapi
     * /users/{userId}:
     *   get:
     *     tags: [Parties]
     *     summary: Get one user
     *     description: Get only one specific user. 
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
     * /users/{userId}/update:
     *   put:
     *     tags: [Parties]
     *     summary: Update an user
     *     description: Update an user.
     *     responses:
     *       201:
     *         description: Return the updated user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/:partyId/update')
        .put(partyController.update_party);

    /**
     * @openapi
     * /users/{userId}/delete:
     *   delete:
     *     tags: [Parties]
     *     summary: Delete an user
     *     description: Delete an user.
     *     responses:
     *       201:
     *         description: Return the deleted user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/:partyId/delete')
        .delete(partyController.delete_party);

    /**
     * @openapi
     * /users/create:
     *   post:
     *     tags: [Parties]
     *     summary: Subscribe an user
     *     description: Subscription for a new user. 
     *     responses:
     *       201:
     *         description: Successfully created a new user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/parties/create')
        .post(partyController.create_party);
}