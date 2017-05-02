var models = require('../models');

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
    if (req.body.tipo == 'estudiante') {
        if (req.body.nivel_diagnosticado) {
            datos['nivel_diagnosticado'] = req.body.nivel_diagnosticado.id;
        }
        if (req.body.nivel_acreditado) {
            datos['nivel_acreditado'] = req.body.nivel_acreditado.id;
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
    }
    if (req.body.tipo == 'profesor') {
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
    }
};

exports.list = function (req, res) {
    var limit = parseInt(req.query.per_page);
    var offset = limit * (parseInt(req.query.page) - 1);

    models.sequelize.query("SELECT *, (SELECT COUNT(*) FROM usuario) as total FROM `usuario` LIMIT :offset,:limit",
        { replacements: { "offset": offset, "limit": limit }, type: models.sequelize.QueryTypes.SELECT })
        .then(function (users) {
            res.json(users);
        });
};

exports.usuarioById = function (req, res, next, id) {
    var User = models.Usuario;
    User.findById(id).then(function (user) {
        if (!user) {
            return next(new Error('Failed to load user ' + id));
        }
        req.user = nivel;
        next();
    }).catch(function (error) {
        return next(err);
    });
};

exports.read = function (req, res) {
    res.json(req.usuario);
};

exports.update = function (req, res) {
    var usuario = req.usuario;
    usuario.update(req.body)
        .then(function (usr) {
            res.json(usr);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.remove = function (req, res) {
    var usuario = req.usuario;
    usuario.destroy({ force: true })
        .then(function (usr) {
            res.json(usr);
        })
        .catch(function (error) {
            console.log(error);
        });
};

exports.renderSignin = function (req, res, next) {
    if (!req.usuario) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};