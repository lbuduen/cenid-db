module.exports = function (app) {
  var usuarios = require('../controllers/usuario.server.controller.js');
  var estudiantes = require('../controllers/estudiante.server.controller.js');
  var profesores = require('../controllers/profesor.server.controller.js');
  var passport = require('passport');

  /*app.route('/api/usuarios')
     .get(usuarios.list)
     .post(usuarios.create);
     
  app.route('/api/usuarios/:idusuario')
     .get(usuarios.read)
     .put(usuarios.update)
     .delete(usuarios.remove);*/

  app.route('/signin')
    .get(usuarios.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    }));
  app.get('/signout', usuarios.signout);

  app.route('/api/estudiantes')
    .get(estudiantes.list)
    .post(usuarios.requiresLogin, estudiantes.create);

  app.route('/api/estudiantes/:idestudiante')
    .get(estudiantes.read)
    .put(usuarios.requiresLogin, estudiantes.update)
    .delete(usuarios.requiresLogin, estudiantes.remove);

  app.route('/api/estudiantes/import/csv')
    .post(usuarios.requiresLogin, estudiantes.importCSV);

  app.route('/api/estudiantes/get/areas')
    .get(estudiantes.getAreas);

  app.route('/api/profesores')
    .get(profesores.list)
    .post(usuarios.requiresLogin, profesores.create);

  app.route('/api/profesores/:idprofesor')
    .get(profesores.read)
    .put(usuarios.requiresLogin, profesores.update)
    .delete(usuarios.requiresLogin, profesores.remove);

  app.param('idusuario', usuarios.usuarioById);
  app.param('idestudiante', estudiantes.estudianteById);
  app.param('idprofesor', profesores.profesorById);
};