module.exports = function (app) {
    var pruebas = require('../controllers/prueba.server.controller.js');
    var usuarios = require('../controllers/usuario.server.controller.js');

    app.route('/api/pruebas')
        .get(pruebas.list)
        .post(usuarios.requiresLogin, pruebas.create);

    app.route('/api/pruebas/:idprueba')
        .get(pruebas.read)
        .put(usuarios.requiresLogin, pruebas.update)
        .delete(usuarios.requiresLogin, pruebas.remove);

    app.route('/api/pruebas/add/estudiantes')
        .post(usuarios.requiresLogin, pruebas.setUp);

    app.route('/api/pruebas/set/notas')
        .post(usuarios.requiresLogin, pruebas.calificar);

    app.route('/api/pruebas/get/habilidades')
        .get(pruebas.getHabilidades);

    app.param('idprueba', pruebas.pruebaById);
};