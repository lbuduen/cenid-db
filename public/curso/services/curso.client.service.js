angular.module('curso').factory('Cursos', ['$resource',
    function ($resource) {
        return $resource('/api/cursos/:idcurso', {
            idcurso: "@id"
        }, {
            update: {
                method: "PUT"
            }
        });
    }
]);