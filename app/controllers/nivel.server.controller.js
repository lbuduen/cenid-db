var models = require('../models');

exports.create = function (req, res) {
    var Nivel = models.Nivel;
    Nivel.create(req.body)
        .then(function (nivel) {
            res.json(nivel);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var sql = "SELECT *, (SELECT COUNT(*) FROM `nivel`) as total FROM `nivel` ORDER BY nombre";
    var replace = {};

    if (req.query.per_page || req.query.page) {
        var limit = parseInt(req.query.per_page);
        var offset = limit * (parseInt(req.query.page) - 1);
        
        sql += " LIMIT :offset,:limit";
        replace = { "offset": offset, "limit": limit };
    }

    models.sequelize.query(sql, {replacements: replace, type: models.sequelize.QueryTypes.SELECT})
      .then(function(niveles) {
        res.json(niveles);
    });
};

exports.nivelById = function (req, res, next, id) {
    var Nivel = models.Nivel;
    Nivel.findById(id).then(function (nivel) {
        if (!nivel) {
            return next(new Error('Failed to load level ' + id));
        }
        req.nivel = nivel;
        next();
    }).catch(function (error) {
        return next(err);
    });
};

exports.read = function (req, res) {
    res.json(req.nivel);
};

exports.update = function (req, res) {
    var nivel = req.nivel;
    nivel.update(req.body)
       .then(function (nivel) {
            res.json(nivel);
        })
        .catch(function (error) {
            console.log(error);
        }); 
};

exports.remove = function (req, res) {
    var nivel = req.nivel;
    nivel.destroy({ force: true })
        .then(function (nivel) {
            res.json(nivel);
        })
        .catch(function (error) {
            console.log(error);
        });  
};