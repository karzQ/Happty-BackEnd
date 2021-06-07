module.exports = (server) => {
    const userController = require("../controllers/userController");

    server
        .route("/users")
            .get(userController.get_all_users)
            .post(userController.create_new_user);

    server
        .route("/users/:userId")
            .get(userController.get_user_by_id)
            .put(userController.update_user)
            .delete(userController.delete_user);

    server
        .route("/users/pseudo/:pseudo")
            .get(userController.get_user_by_pseudo);

    server
        .route("/login")
            .post(userController.login_user);
}

