module.exports = function (app) {
    var grupos = require('../controllers/grupo.server.controller.js');
    var usuarios = require('../controllers/usuario.server.controller.js');

    app.route('/api/grupos')
        .get(grupos.list)
        .post(usuarios.requiresLogin, grupos.create);

    app.route('/api/grupos/:idgrupo')
        .get(grupos.read)
        .put(usuarios.requiresLogin, grupos.update)
        .delete(usuarios.requiresLogin, grupos.remove);

    app.route('/api/grupos/:idgrupo/del/estudiante/:idestudiante')
        .delete(usuarios.requiresLogin, grupos.removeEstudiante);

    app.param('idgrupo', grupos.grupoById);
};