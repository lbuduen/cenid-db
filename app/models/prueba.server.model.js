module.exports = function (sequelize, DataTypes) {
    var Prueba = sequelize.define('Prueba', {
        titulo: {type: DataTypes.STRING, allowNull: false},
        fecha: {type: DataTypes.DATE, allowNull: false},
        codigo: {type: DataTypes.STRING(10), allowNull: false},
    }, {
        classMethods: {
            associate: function (models) {
                Prueba.belongsToMany(models.Nivel, {through: 'PruebahasNivel'});
                // Prueba.belongsToMany(models.Estudiante, {through: models.EstudiantePrueba});
            }
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'prueba',
        indexes: [
            {
              name: 'codigo',
              fields: ['codigo']
            }
        ]
    });

    return Prueba;
};