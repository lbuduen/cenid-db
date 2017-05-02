angular.module('usuario').factory('Profesores', ['$resource',
    function ($resource) {
        return $resource('api/profesores/:id', {
            id: "@id"
        }, {
            "update": {
                method: "PUT"
            },
            "delete": {
                method: "DELETE",
                params: {
                    id: "@idprofesor"
                }
            }
        });
    }
]);