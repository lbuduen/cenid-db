var models = require('../models');

exports.create = function (req, res) {
    var Local = models.Local;
    Local.create(req.body)
        .then(function (local) {
            res.json(local);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.list = function (req, res) {
    var sql = "SELECT *, (SELECT COUNT(*) FROM `local`) as total FROM `local`";
    var replace = {};

    if (req.query.per_page || req.query.page) {
        var limit = parseInt(req.query.per_page);
        var offset = limit * (parseInt(req.query.page) - 1);
        
        sql += " LIMIT :offset,:limit";
        replace = { "offset": offset, "limit": limit };
    }

    models.sequelize.query(sql, {replacements: replace, type: models.sequelize.QueryTypes.SELECT})
      .then(function(locales) {
        res.json(locales);
    });
};

exports.localById = function (req, res, next, id) {
    var Local = models.Local;
    Local.findById(id).then(function (local) {
        if (!local) {
            return next(new Error('Failed to load local ' + id));
        }
        req.local = local;
        next();
    }).catch(function (error) {
        return next(err);
    });
};

exports.read = function (req, res) {
    res.json(req.local);
};

exports.update = function (req, res) {
    var local = req.local;
    local.update(req.body)
       .then(function (local) {
            res.json(local);
        })
        .catch(function (error) {
            console.log(error);
        }); 
};

exports.remove = function (req, res) {
    var local = req.local;
    local.destroy({ force: true })
        .then(function (local) {
            res.json(local);
        })
        .catch(function (error) {
            console.log(error);
        });  
};