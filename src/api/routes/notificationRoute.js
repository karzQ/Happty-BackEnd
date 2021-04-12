module.exports = (server) => {
    const notificationController = require("../controllers/notificationController");

    /**
     * Route to get all notifications of a user, or create a new one.
     * @name get/post/notifications/:userId
     * @memberof module:routers/notificationRoute
     * @param {string} path - Express path.
     * @param {string} userId - Id of the user.
     * @param {object} req.body - The JSON payload.
     */ 
    server
        .route("/notifications/:userId")
            .get(notificationController.get_all_notification)
            .post(notificationController.create_notification);

    /**
     * Route to get all notifications of a user, or create a new one.
     * @name get/put/delete/notifications/users/:userId/:notificationId
     * @memberof module:routers/notificationRoute
     * @param {string} path - Express path.
     * @param {string} userId - Id of the user.
     * @param {string} notificationId - Id of the notification.
     * @param {object} req.body - The JSON payload (for PUT only).
     */ 
    server
    .route("/notifications/users/:userId/:notificationId")
        .get(notificationController.get_one_notification)
        .put(notificationController.update_one_notification)
        .delete(notificationController.delete_one_notification);
}