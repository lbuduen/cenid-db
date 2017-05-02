angular.module('usuario').factory('Estudiantes', ['$resource',
    function ($resource) {
        return $resource('api/estudiantes/:id', {
            id: "@id"
        }, {
            "update": {
                method: "PUT"
            },
            "delete": {
                method: "DELETE",
                params: {
                    id: "@idestudiante"
                }
            }
        });
    }
]);