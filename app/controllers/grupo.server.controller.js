var models = require('../models');

exports.create = function (req, res) {
    var Grupo = models.Grupo;
    Grupo.create({nombre: req.body.nombre})
        .then(function (grupo) {
            grupo.setEstudiantes(req.body.estudiantes);
            res.json(grupo);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var Grupo = models.Grupo;
    Grupo.findAll().then(function (grupos) {
        res.json(grupos);
    });
};

exports.grupoById = function (req, res, next, id) {
    var Grupo = models.Grupo;
    Grupo.findById(id, {include: [{model: models.Estudiante, include: [{model: models.Usuario, required: true}]}]}).then(function (grupo) {
        if (!grupo) {
            return next(new Error('Failed to load group ' + id));
        }
        req.grupo = grupo;
        next();
    }).catch(function (error) {
        return next(err);
    });
};

exports.read = function (req, res) {
    res.json(req.grupo);
};

exports.update = function (req, res) {
    var grupo = req.grupo;
    
    grupo.update({nombre: req.body.nombre})
        .then(function (grupo) {
            if (req.body.estudiantes) {
                grupo.addEstudiantes(req.body.estudiantes);
            }
            res.json(grupo);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.remove = function (req, res) {
    var grupo = req.grupo;
    grupo.destroy({ force: true })
        .then(function (grupo) {
            res.json(grupo);
        })
        .catch(function (error) {
            console.log(error);
        });  
};

exports.removeEstudiante = function (req, res) {
    req.grupo.removeEstudiante(req.params.idestudiante);
    res.end();
};