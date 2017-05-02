module.exports = function (sequelize, DataTypes) {
    var Estudiante = sequelize.define('Estudiante', {
        observaciones: DataTypes.TEXT('tiny')
    }, {
        classMethods: {
            associate: function (models) {
                Estudiante.belongsTo(models.Usuario, {onDelete: "CASCADE"});
                Estudiante.belongsTo(models.Nivel, {as: 'NivelD', foreignKey: 'nivel_diagnosticado'});
                Estudiante.belongsTo(models.Nivel, {as: 'NivelA', foreignKey: 'nivel_acreditado'});
                Estudiante.belongsTo(models.Grupo);
                // Estudiante.belongsToMany(models.Prueba, {through: models.EstudiantePrueba});
            }
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'estudiante'
    });

    return Estudiante;
};