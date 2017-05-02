module.exports = function () {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var models = require('../models');

    passport.use(new LocalStrategy({
        usernameField: 'email', passwordField: 'clave'
    },
        function (email, passwd, done) {
            User.findOne({
                where: { email: email }
            }).then(user => {
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(passwd)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            }).catch(err => {
                if (err) {
                    return done(err);
                }
            });
        }));
    var User = models.Usuario;

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id: id },
            attributes: { exclude: ['clave', 'salt'] }
        }).then(user => { done(null, user) }).catch(err => { done(err, null) });
    });
}