exports.render = function (req, res) {
    res.render('index', {
        title: 'CENID',
        user: JSON.stringify(req.user)
    });
};

exports.search = function (req, res) {
    var models = require('../models');

    var search_results = {
        "Estudiantes": [],
        "Profesores": [],
        "Pruebas": [],
        "Cursos": [],
    };

    // buscar estudiantes
    var esql = `SELECT * 
                FROM usuario u INNER JOIN estudiante e ON u.id = e.usuario_id 
                WHERE u.nombre LIKE '%${req.body.term}%' OR u.apellidos LIKE '%${req.body.term}%' OR u.email LIKE '%${req.body.term}%'`;

    // buscar profesores
    var psql = `SELECT * 
                FROM usuario u INNER JOIN profesor p ON u.id = p.usuario_id 
                WHERE u.nombre LIKE '%${req.body.term}%' OR u.apellidos LIKE '%${req.body.term}%' OR u.email LIKE '%${req.body.term}%'`;

    // buscar pruebas
    var tsql = `SELECT * FROM prueba p WHERE p.titulo LIKE '%${req.body.term}%' OR p.codigo LIKE '%${req.body.term}%'`;

    // buscar cursos
    var csql = `SELECT * FROM curso c WHERE c.titulo LIKE '%${req.body.term}%'`;

    return models.sequelize.transaction(function (t) {
        return Promise.all([
            models.sequelize.query(esql, {transaction: t}).spread(function (results, metadata) {
                search_results.Estudiantes = results;
            }),
            models.sequelize.query(psql, {transaction: t}).spread(function (results, metadata) {
                search_results.Profesores = results;
            }),
            models.sequelize.query(tsql, {transaction: t}).spread(function (results, metadata) {
                search_results.Pruebas = results;
            }),
            models.sequelize.query(csql, {transaction: t}).spread(function (results, metadata) {
                search_results.Cursos = results;
            })
        ]);
    }).then(function (result) {
        res.json(search_results);
    }).catch(function (err) {
        console.log(err);
    });
};