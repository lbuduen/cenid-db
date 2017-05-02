module.exports = function (sequelize, DataTypes) {
    var Nivel = sequelize.define('Nivel', {
        nombre: {type: DataTypes.STRING(40), allowNull: false, unique: true},
        descripcion: DataTypes.TEXT('tiny')
    }, {
        classMethods: {
            associate: function (models) {
                Nivel.belongsToMany(models.Prueba, {through: 'PruebahasNivel'});
            }
        },
        name: {
            plural: 'niveles',
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'nivel'
    });

    return Nivel;
};