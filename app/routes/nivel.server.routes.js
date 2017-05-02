module.exports = function (app) {
    var niveles = require('../controllers/nivel.server.controller.js');
    var usuarios = require('../controllers/usuario.server.controller.js');

    app.route('/api/niveles')
        .get(niveles.list)
        .post(usuarios.requiresLogin, niveles.create);

    app.route('/api/niveles/:idnivel')
        .get(niveles.read)
        .put(usuarios.requiresLogin, niveles.update)
        .delete(usuarios.requiresLogin, niveles.remove);

    app.param('idnivel', niveles.nivelById);
};