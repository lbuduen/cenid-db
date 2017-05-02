module.exports = function (sequelize, DataTypes) {
    var Curso = sequelize.define('Curso', {
        titulo: {type: DataTypes.STRING, allowNull: false},
        descripcion: {type: DataTypes.TEXT},
        fecha_inicio: DataTypes.DATE,
        fecha_fin: DataTypes.DATE,
    }, {
        classMethods: {
            associate: function (models) {
                Curso.belongsToMany(models.Profesor, {through: 'ProfesordelCurso'});
                Curso.hasMany(models.Grupo);
            }
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'curso'
    });

    return Curso;
};