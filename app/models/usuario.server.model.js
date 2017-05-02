var crypto = require('crypto');

var hashPassword = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
};

module.exports = function (sequelize, DataTypes) {
    var Usuario = sequelize.define('Usuario', {
        nombre: { type: DataTypes.STRING(40), allowNull: false },
        apellidos: { type: DataTypes.STRING(70), allowNull: false },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        area: DataTypes.STRING(100),
        clave: DataTypes.STRING,
        salt: DataTypes.STRING,
        provider: DataTypes.STRING,
        providerId: DataTypes.STRING
    }, {
            hooks: {
                beforeCreate: function (user, options) {
                    if (user.clave) {
                        user.salt = 'sIU89FMJ6EaPu7vdAlXhiPuwje';
                        user.clave = hashPassword(user.clave, user.salt);
                    }
                }
            },
            getterMethods: {
                nombreCompleto: function () {
                    return this.getDataValue('nombre') + ' ' + this.getDataValue('apellidos');
                }
            },
            instanceMethods: {
                authenticate: function (password) {
                    return this.clave === hashPassword(password, this.salt);
                }
            },
            underscored: true,
            freezeTableName: true,
            tableName: 'usuario'
        });

    return Usuario;
};