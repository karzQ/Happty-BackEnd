module.exports = (server) => {
    const userController = require("../controllers/userController");

    /**
     * Route to get all users or create a new user.
     * @name get/post/users
     * @memberof module:routers/userRoute
     * @param {string} path - Express path
     * @param {string} privateCode - Query parameter (path?privateCode=String) to specify if you want to sign from an invitation link or by default.
     * @param {Object} req.body - The JSON payload.
     */ 
    server
        .route("/users")
            .get(userController.get_all_users)
            .post(userController.create_new_user);

    /**
     * Route to get, update or delete a user by his ID.
     * @name get/put/post/users/:userId
     * @memberof module:routers/userRoute
     * @param {string} path - Express path
     * @param {string} userId - Id of the user
     * @param {Object} req.body - The body must include the new object to update it.
     */  
    server
        .route("/users/:userId")
            .get(userController.get_user_by_id)
            .put(userController.update_user)
            .delete(userController.delete_user);

    /**
     * Route to get a user by his pseudo.
     * @name get/users/pseudo/:pseudo
     * @memberof module:routers/userRoute
     * @param {string} path - Express path
     * @param {string} pseudo - Pseudo of the user
     */      
    server
        .route("/users/pseudo/:pseudo")
            .get(userController.get_user_by_pseudo);

    /**
     * Route to login a user.
     * @name post/login
     * @memberof module:routers/userRoute
     * @param {string} path - Express path
     * @param {Object} req.body - The body must include 2 keys : userMail and userPassword.
     */
    server
        .route("/login")
            .post(userController.login_user);
}

