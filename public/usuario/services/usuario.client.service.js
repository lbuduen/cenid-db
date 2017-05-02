angular.module('usuario').factory('Usuarios', ['$resource',
    function ($resource) {
        return $resource('api/usuarios/:idusuario', {
            idusuario: "@id"
        }, {
            update: {
                method: "PUT"
            },
            getEstudiante: {
                method: "GET",
                params: {
                    id: "@id"
                },
                url: 'api/estudiantes/:id'
            },
            getProfesor: {
                method: "GET",
                params: {
                    id: "@id"
                },
                url: 'api/profesores/:id'
            }
        });
    }
]);