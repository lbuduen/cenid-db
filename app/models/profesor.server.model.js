module.exports = function (sequelize, DataTypes) {
    var Profesor = sequelize.define('Profesor', {
        curriculum: {type: DataTypes.TEXT}
    }, {
        classMethods: {
            associate: function (models) {
                Profesor.belongsTo(models.Usuario, {onDelete: "CASCADE"});
                Profesor.belongsToMany(models.Curso, {through: 'ProfesordelCurso'});
            }
        },
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'profesor'
    });

    return Profesor;
};