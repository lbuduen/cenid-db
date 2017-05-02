angular.module('prueba').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/pruebas', {
                templateUrl: "prueba/views/list.client.view.html"
            })
            .when('/pruebas/create', {
                templateUrl: "prueba/views/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/pruebas');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/pruebas/:idprueba', {
                templateUrl: "prueba/views/read.client.view.html"
            })
            .when('/pruebas/:idprueba/edit', {
                templateUrl: "prueba/views/update.client.view.html",

                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/pruebas');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .otherwise({
                redirectTo: "/"
            });
    }
]);