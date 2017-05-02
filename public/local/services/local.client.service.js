angular.module('local').factory('Locales', ['$resource',
    function ($resource) {
        return $resource('/api/locales/:idlocal', {
            idlocal: "@id"
        }, {
            update: {
                method: "PUT"
            }
        });
    }
]);