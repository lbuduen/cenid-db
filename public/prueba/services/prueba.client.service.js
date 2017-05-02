angular.module('prueba').factory('Pruebas', ['$resource',
    function ($resource) {
        return $resource('/api/pruebas/:idprueba', {
            idprueba: "@idprueba"
        }, {
            update: {
                method: "PUT"
            }
        });
    }
]);