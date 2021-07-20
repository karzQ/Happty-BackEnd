module.exports = (server) => {
    const controller = require('../controllers/userController');

    server.route('/users')
        .get(controller.get_all_users);
}