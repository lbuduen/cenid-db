var models = require('../models');

var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');

exports.create = function (req, res) {
    var datos = {
        Usuario: {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            email: req.body.email,
            area: req.body.area,
            clave: req.body.clave,
        }
    };
    if (req.body.nivel_diagnosticado) {
        datos['nivel_diagnosticado'] = req.body.nivel_diagnosticado;
    }
    if (req.body.nivel_acreditado) {
        datos['nivel_acreditado'] = req.body.nivel_acreditado;
    }
    if (req.body.observaciones) {
        datos['observaciones'] = req.body.observaciones;
    }

    var Estudiante = models.Estudiante;
    Estudiante.create(datos, { include: [models.Usuario] })
        .then(function (est) {
            res.json(est);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var limit = parseInt(req.query.per_page);
    var offset = limit * (parseInt(req.query.page) - 1);
    var subsql = (req.query.grupo) ? "SELECT COUNT(*) FROM `estudiante` WHERE `estudiante`.grupo_id IS NULL" : "SELECT COUNT(*) FROM `estudiante`";
    var sql = "SELECT u.*, e.id as idestudiante, (" + subsql + ") as total, n.nombre as nivel_diagnosticado FROM `estudiante` e INNER JOIN `usuario` u ON e.usuario_id = u.id LEFT OUTER JOIN `nivel` n ON e.nivel_diagnosticado = n.id ";
    if (req.query.grupo) {
        sql += "WHERE e.grupo_id IS NULL ";
    }
    sql += "LIMIT :offset,:limit";
    models.sequelize.query(sql, { replacements: { "offset": offset, "limit": limit }, type: models.sequelize.QueryTypes.SELECT })
        .then(function (users) {
            res.json(users);
        });
};

exports.estudianteById = function (req, res, next, id) {
    var Estudiante = models.Estudiante;
    Estudiante.findOne({
        where: { id: id },
        include: [
            { model: models.Usuario, required: true },
            { model: models.Nivel, as: 'NivelD' },
            { model: models.Nivel, as: 'NivelA' },
        ]
    }).then(function (est) {
        if (!est) {
            return next(new Error('Failed to load student ' + id));
        }
        req.usuario = est;
        next();
    }).catch(function (error) {
        return next(error);
    });

};

exports.read = function (req, res) {
    res.json(req.usuario);
};

exports.update = function (req, res) {
    return models.sequelize.transaction(function (t) {

        return models.Usuario.update({
            nombre: req.body.Usuario.nombre,
            apellidos: req.body.Usuario.apellidos,
            email: req.body.Usuario.email,
            area: req.body.Usuario.area,
            clave: req.body.Usuario.clave,
        }, {
                where: { id: req.usuario.Usuario.id },
                transaction: t
            }).then(function (usr) {
                return req.usuario.update(req.body, { transaction: t });
            });

    }).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        console.log(err);
    });
};

exports.remove = function (req, res) {
    var Usuario = models.Usuario;
    Usuario.destroy({
        where: {
            id: req.usuario.Usuario.id
        },
        force: true
    })
        .then(function () {
            res.end();
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.getAreas = function (req, res) {
    var Usuario = models.Usuario;
    var Estudiante = models.Estudiante;
    Estudiante.findAll({
        include: [{
            model: models.Usuario,
            attributes: ['area']
        }]
    })
    .then(function (result) {
        var areas = [];
        result.forEach(est => {
            areas.push(est.Usuario.area);
        })
        res.json(areas);
    })
    .catch(function (err) {
        console.log(err);
    });
}

exports.importCSV = function (req, res) {
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    var csv = req.files.csv;
    var ruta = path.join(process.cwd(), '/public/csv/listado_estudiantes.csv');
    csv.mv(ruta, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
    });

    var estudiantes = [];
    var count = 0;
    fs.createReadStream(ruta, { encoding: 'utf8' })
        .pipe(parse())
        .on('data', function (csvrow) {
            if (count++) {
                var datos = {
                    Usuario: {
                        nombre: csvrow[0],
                        apellidos: csvrow[1],
                        email: csvrow[2],
                        area: csvrow[3],
                    }
                };
                estudiantes.push(datos);
            }
        })
        .on('end', function () {
            estudiantes.forEach(estudiante => {
                var Estudiante = models.Estudiante;
                Estudiante.create(estudiante, { include: [models.Usuario] })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
            res.send('ok');
        });
};