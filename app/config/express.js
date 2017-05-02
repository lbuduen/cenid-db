var config = require('./config');

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var favicon = require('serve-favicon');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var passport = require('passport');

module.exports = function () {
    var app = express();

    app.use(favicon(path.dirname(require.main.filename) + '/public/img/logo_sintxt.png'));

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(fileUpload());

    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('port', process.env.PORT || 3000);

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // routes
    require('../routes/index.server.routes.js')(app);
    require('../routes/usuario.server.routes.js')(app);
    require('../routes/nivel.server.routes.js')(app);
    require('../routes/local.server.routes.js')(app);
    require('../routes/curso.server.routes.js')(app);
    require('../routes/grupo.server.routes.js')(app);
    require('../routes/prueba.server.routes.js')(app);

    app.use(express.static('./public'));
    
    return app;
};