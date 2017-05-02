angular.module('nivel').factory('Niveles', ['$resource',
    function ($resource) {
        return $resource('/api/niveles/:idnivel', {
            idnivel: "@id"
        }, {
            update: {
                method: "PUT"
            }
        });
    }
]);