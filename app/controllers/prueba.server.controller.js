var models = require('../models');

exports.create = function (req, res) {
    var Prueba = models.Prueba;
    Prueba.create(req.body)
        .then(function (prueba) {
            prueba.setNiveles(req.body.niveles);
            res.json(prueba);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var sql = "SELECT id as idprueba, titulo, fecha, codigo, (SELECT COUNT(*) FROM `prueba`) as total FROM `prueba`";
    var replace = {};

    if (req.query.per_page || req.query.page) {
        var limit = parseInt(req.query.per_page);
        var offset = limit * (parseInt(req.query.page) - 1);

        sql += " LIMIT :offset,:limit";
        replace = { "offset": offset, "limit": limit };
    }

    models.sequelize.query(sql,
        { replacements: replace, type: models.sequelize.QueryTypes.SELECT })
        .then(function (pruebas) {
            res.json(pruebas);
        });
};

exports.pruebaById = function (req, res, next, id) {
    var sql = `select e.id as idestudiante, CONCAT(u.nombre, ' ', u.apellidos) AS nombre_completo, u.email, u.area, l.id as idlocal, l.ubicacion, p.id as idprueba, p.titulo, p.fecha, p.codigo, h.id as idhabilidad, h.nombre as habilidad, ep.estado, ep.nota
                from usuario u 
                inner join estudiante e on u.id = e.usuario_id 
                inner join estudianteprueba ep on e.id = ep.estudiante_id 
                inner join habilidad h on h.id = ep.habilidad_id 
                inner join prueba p on ep.prueba_id = p.id                
                inner join local l on ep.local_id = l.id
                where ep.prueba_id = :idprueba ORDER BY idestudiante, idlocal, habilidad`;

    var replace = { "idprueba": id };

    if (req.query.per_page || req.query.page) {
        var limit = parseInt(req.query.per_page);
        var offset = limit * (parseInt(req.query.page) - 1);

        sql += " LIMIT :offset,:limit";
        replace = { "idprueba": id, "offset": offset, "limit": limit };
    }
    models.sequelize.query(sql,
        { replacements: replace, type: models.sequelize.QueryTypes.SELECT })
        .then(function (pruebas) {

            if (pruebas.length) {
                var p = {
                    "Estudiantes": [],
                    "niveles": [],
                    "habilidades": []
                };

                pruebas.forEach(function (prueba) {
                    if (!p.habilidades.find(h => h.id == prueba.idhabilidad)) {
                        p.habilidades.push({ id: prueba.idhabilidad, nombre: prueba.habilidad });
                    }
                });

                p.titulo = pruebas[0].titulo;
                p.fecha = pruebas[0].fecha;
                p.codigo = pruebas[0].codigo;
                p.idprueba = pruebas[0].idprueba;

                var idestudiante = 0;
                var idhabilidades = [];
                var estudiante = {};
                estudiante.nota = [];
                pruebas.forEach(function (prueba) {

                    if (idestudiante != prueba.idestudiante) {
                        estudiante.idestudiante = prueba.idestudiante;
                        estudiante.nombre_completo = prueba.nombre_completo;
                        estudiante.area = prueba.area;
                        estudiante.email = prueba.email;
                        estudiante.idlocal = prueba.idlocal;
                        estudiante.ubicacion = prueba.ubicacion;
                        estudiante.estado_prueba = prueba.estado;
                        estudiante.nota.push({
                            habilidad: prueba.habilidad,
                            nota: prueba.nota
                        });
                        idhabilidades.push(prueba.idhabilidad);

                        if (p.habilidades.length == 1) {
                            p.Estudiantes.push(estudiante);
                            estudiante = {};
                            estudiante.nota = [];
                            idhabilidades = [];
                        }
                    }
                    else if (!idhabilidades.find(h => h == prueba.idhabilidad)) {
                        estudiante.nota.push({
                            habilidad: prueba.habilidad,
                            nota: prueba.nota
                        });

                        idhabilidades.push(prueba.idhabilidad);

                        if (idhabilidades.length == p.habilidades.length) {
                            p.Estudiantes.push(estudiante);
                            estudiante = {};
                            estudiante.nota = [];
                            idhabilidades = [];
                        }
                    }

                    idestudiante = prueba.idestudiante;
                });
                var sqln = `SELECT n.id, n.nombre FROM prueba p inner join pruebahasnivel ph on p.id = ph.prueba_id INNER join nivel n ON ph.nivel_id = n.id where p.id = ${id}`;
                models.sequelize.query(sqln, { type: models.sequelize.QueryTypes.SELECT })
                    .then(function (niveles) {
                        niveles.forEach(nivel => {
                            p.niveles.push(nivel);
                        });
                        req.prueba = p;
                        next();
                    });
            }
            else {
                var Prueba = models.Prueba;
                Prueba.findById(id, { include: [{ model: models.Estudiante, include: [{ model: models.Usuario }] }, { model: models.Nivel }] }).then(function (prueba) {
                    if (!prueba) {
                        return next(new Error('Failed to load test ' + id));
                    }
                    req.prueba = prueba;
                    next();
                }).catch(function (error) {
                    return next(error);
                });
            }
        });
};

exports.read = function (req, res) {
    res.json(req.prueba);
};

exports.update = function (req, res) {
    var prueba = req.prueba;
    prueba.update(req.body)
        .then(function (prueba) {
            prueba.setNiveles(req.body.niveles_id)
            res.json(prueba);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.remove = function (req, res) {
    var Prueba = models.Prueba;
    var prueba = req.prueba;
    var idprueba = prueba.idprueba;

    Prueba.destroy({
        where: {
            id: idprueba
        },
        force: true
    })
        .then(function (prueba) {
            models.sequelize.query(`DELETE FROM estudianteprueba WHERE prueba_id = ${idprueba}`).spread(function (results, metadata) {
                res.json(metadata);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.getHabilidades = function (req, res) {
    var sql = "SELECT * FROM `habilidad`";
    models.sequelize.query(sql,
        { type: models.sequelize.QueryTypes.SELECT })
        .then(function (hab) {
            res.json(hab);
        });
};

exports.setUp = function (req, res) {

    var Prueba = models.Prueba;
    Prueba.create({
        titulo: req.body.titulo,
        fecha: req.body.fecha,
        codigo: req.body.codigo
    })
        .then(function (prueba) {
            prueba.setNiveles(req.body.niveles);

            var estudiantes = req.body.estudiantes;
            var locales = req.body.locales;
            var habilidades = req.body.habilidades;

            if (req.body.shuffle) {
                shuffle(estudiantes);
            }

            var sql = "INSERT INTO estudianteprueba(`estado`,`estudiante_id`,`prueba_id`,`local_id`, `habilidad_id`) VALUES";
            var values = [];

            var i = 0, j = 0;
            while (i < estudiantes.length && j < locales.length) {
                var l = locales[j].capacidad; //capacidad del local
                var u = 0; // cantidad de ubicados en ese local
                while (u < l && i < estudiantes.length) {
                    var h = 0;
                    while (h < habilidades.length) {
                        var value = [1, estudiantes[i], prueba.id, locales[j].id, habilidades[h++]];
                        values.push("(" + value.join() + ")");
                    }
                    i++; u++;
                }
                j++;
            }
            sql += values.join();
            models.sequelize.query(sql).spread(function (results, metadata) {
                res.json(metadata);
            });

        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.calificar = function (req, res) {
    var sql = "UPDATE estudianteprueba SET `nota`= :n, estado = 2 WHERE habilidad_id = :h AND estudiante_id = :e AND prueba_id = :p";
    return models.sequelize.transaction(function (t) {
        return Promise.all([
            req.body.forEach(nota => {
                models.sequelize.query(sql, {
                    replacements: {
                        n: nota.nota,
                        h: nota.habilidad_id,
                        e: nota.estudiante_id,
                        p: nota.prueba_id
                    },
                    transaction: t
                }).spread(function (results, metadata) {
                    // res.json(metadata);
                });
            })
        ]);
    }).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        console.log(err);
    });
};

function shuffle(array) {
    var i = 0, j = 0, temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}