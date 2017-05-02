module.exports = function (sequelize, DataTypes) {
    var Grupo = sequelize.define('Grupo', {
        nombre: {type: DataTypes.STRING(40), allowNull: false},
    }, {
        classMethods: {
            associate: function (models) {
                Grupo.belongsTo(models.Curso);
                Grupo.hasMany(models.Estudiante);
            }
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'grupo'
    });

    return Grupo;
};