module.exports = function (sequelize, DataTypes) {
    var EstudiantePrueba = sequelize.define('EstudiantePrueba', {
        estado: {
            type: DataTypes.BOOLEAN,
            comment: "0-solicitada 1-aceptada 2-completada"
        },
        nota: DataTypes.STRING(20),
        habilidad_id: DataTypes.BIGINT(11),
        local_id: DataTypes.BIGINT(11),
        estudiante_id: DataTypes.BIGINT(11),
        prueba_id: DataTypes.BIGINT(11),
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'EstudiantePrueba'
    });

    return EstudiantePrueba;
};