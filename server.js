process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require('./app/models');
var express = require('./app/config/express');
var passport = require('./app/config/passport')();

var app = express();

db.sequelize.sync().then(function () {
    var server = app.listen(app.get('port'), function() {
        console.log('CENID server listening on port ' + server.address().port);
    });
});

module.exports = app;