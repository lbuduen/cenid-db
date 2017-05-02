module.exports = function (app) {
    var cursos = require('../controllers/curso.server.controller.js');
    var usuarios = require('../controllers/usuario.server.controller.js');

    app.route('/api/cursos')
        .get(cursos.list)
        .post(usuarios.requiresLogin, cursos.create);

    app.route('/api/cursos/:idcurso')
        .get(cursos.read)
        .put(usuarios.requiresLogin, cursos.update)
        .delete(usuarios.requiresLogin, cursos.remove);

    app.route('/api/cursos/:idcurso/add/profesor')
        .post(usuarios.requiresLogin, cursos.addProfesor);

    app.route('/api/cursos/:idcurso/add/grupo')
        .post(usuarios.requiresLogin, cursos.addGrupo);

    app.param('idcurso', cursos.cursoById);
};