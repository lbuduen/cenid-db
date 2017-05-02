module.exports = function (sequelize, DataTypes) {
    var Habilidad = sequelize.define('Habilidad', {
        nombre: {type: DataTypes.STRING(40), allowNull: false, unique: true},
        descripcion: DataTypes.TEXT('tiny')
    }, {
        name: {
            plural: 'habilidades',
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'habilidad'
    });

    return Habilidad;
};