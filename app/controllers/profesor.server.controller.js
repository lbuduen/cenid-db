var models = require('../models');

exports.create = function (req, res) {
    var datos = {
        Usuario: {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            email: req.body.email,
            area: req.body.area,
            clave: req.body.clave,
            provider: 'local'
        }
    };
    if (req.body.curriculum) {
        datos['curriculum'] = req.body.curriculum;
    }

    var Profesor = models.Profesor;
    Profesor.create(datos, { include: [models.Usuario] })
        .then(function (prof) {
            res.json(prof);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var limit = parseInt(req.query.per_page);
    var offset = limit * (parseInt(req.query.page) - 1);
    var sql = "SELECT u.*, p.id as idprofesor, (SELECT COUNT(*) FROM `profesor`) as total FROM `profesor` p INNER JOIN `usuario` u ON p.usuario_id = u.id";
    var replace = {};

    if (req.query.per_page || req.query.page) {
        sql += " LIMIT :offset,:limit";
        replace = { "offset": offset, "limit": limit };
    }
    models.sequelize.query(sql, {replacements: replace, type: models.sequelize.QueryTypes.SELECT})
      .then(function(users) {
        res.json(users);
      });
};

exports.profesorById = function (req, res, next, id) {
    var Profesor = models.Profesor;
    Profesor.findOne({
        where: {id: id},
        include: [
            {model: models.Usuario, required: true},
        ]
    }).then(function (prof) {
        if (!prof) {
            return next(new Error('Failed to load professor ' + id));
        }
        req.usuario = prof;
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
            where: {id: req.usuario.Usuario.id},
            transaction: t
        }).then(function (usr) {
            return req.usuario.update(req.body, {transaction: t});
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
    }).then(function () {
        res.end();
    })
    .catch(function (error) {
        console.log(error);
    });  
};