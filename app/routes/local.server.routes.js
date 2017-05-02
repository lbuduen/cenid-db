module.exports = function (app) {
    var locales = require('../controllers/local.server.controller.js');
    var usuarios = require('../controllers/usuario.server.controller.js');

    app.route('/api/locales')
        .get(locales.list)
        .post(usuarios.requiresLogin, locales.create);

    app.route('/api/locales/:idlocal')
        .get(locales.read)
        .put(usuarios.requiresLogin, locales.update)
        .delete(usuarios.requiresLogin, locales.remove);

    app.param('idlocal', locales.localById);
};