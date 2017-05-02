module.exports = function (sequelize, DataTypes) {
    var Local = sequelize.define('Local', {
        ubicacion: {type: DataTypes.STRING, allowNull: false, unique: true},
        capacidad: {type: DataTypes.INTEGER, allowNull: false},
        disponibilidad: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'local',
        name: {
            plural: 'locales',
        },
    });

    return Local;
};