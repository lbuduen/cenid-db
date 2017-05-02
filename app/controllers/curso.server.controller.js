var models = require('../models');

exports.create = function (req, res) {
    var Curso = models.Curso;
    Curso.create(req.body)
        .then(function (curso) {
            res.json(curso);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var limit = parseInt(req.query.per_page);
    var offset = limit * (parseInt(req.query.page) - 1);

    models.sequelize.query("SELECT *, (SELECT COUNT(*) FROM `curso`) as total FROM `curso` LIMIT :offset,:limit", 
      {replacements: { "offset": offset, "limit": limit }, type: models.sequelize.QueryTypes.SELECT})
      .then(function(cursos) {
        res.json(cursos);
    });
};

exports.cursoById = function (req, res, next, id) {
    var Curso = models.Curso;
    Curso.findById(id, {include: [{model: models.Profesor, include: [{model: models.Usuario}]}, {model: models.Grupo}]}).then(function (curso) {
        if (!curso) {
            return next(new Error('Failed to load course ' + id));
        }
        req.curso = curso;
        next();
    }).catch(function (error) {
        return next(err);
    });
};

exports.read = function (req, res) {
    res.json(req.curso);
};

exports.update = function (req, res) {
    var curso = req.curso;
    curso.update(req.body)
       .then(function (curso) {
            res.json(curso);
        })
        .catch(function (error) {
            console.log(error);
        }); 
};

exports.remove = function (req, res) {
    var curso = req.curso;
    curso.destroy({ force: true })
        .then(function (curso) {
            res.json(curso);
        })
        .catch(function (error) {
            console.log(error);
        });  
};

exports.addProfesor = function (req, res) {
    var curso = req.curso;
    curso.setProfesors(null).then(function () {
        curso.addProfesors(req.body.profesores)
        .then(function (curso) {
            res.json(curso);
        })
        .catch(function (error) {
            console.log(error);
        });  
    });
};

exports.addGrupo = function (req, res) {
    var curso = req.curso;
    curso.setGrupos(req.body.grupos)
        .then(function (c) {
            res.json(curso);
        })
        .catch(function (error) {
            console.log(error);
        });  
};