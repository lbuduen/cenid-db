angular.module('grupo').factory('Grupos', ['$resource',
    function ($resource) {
        return $resource('/api/grupos/:idgrupo', {
            idgrupo: "@id"
        }, {
            update: {
                method: "PUT"
            },
            removeEstudiante: {
                method: "DELETE",
                url: "/api/grupos/:idgrupo/del/estudiante/:idestudiante",
                params: {
                    idestudiante: "@idestudiante"
                }
            }
        });
    }
]);