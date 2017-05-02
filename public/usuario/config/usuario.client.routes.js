angular.module('usuario').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            /*.when('/usuarios', {
                templateUrl: "usuario/views/list.client.view.html"
            })
            .when('/usuarios/create', {
                templateUrl: "usuario/views/create.client.view.html"
            })
            .when('/usuarios/:idusuario', {
                templateUrl: "usuario/views/read.client.view.html"
            })
            .when('/usuarios/:idusuario/edit', {
                templateUrl: "usuario/views/update.client.view.html"
            })*/
            .when('/estudiantes', {
                templateUrl: "usuario/views/estudiante/list.client.view.html"
            })
            .when('/estudiantes/create', {
                templateUrl: "usuario/views/estudiante/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/estudiantes');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/estudiantes/:idusuario', {
                templateUrl: "usuario/views/estudiante/read.client.view.html"
            })
            .when('/estudiantes/:idusuario/edit', {
                templateUrl: "usuario/views/estudiante/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/estudiantes');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/estudiantes/import/csv', {
                templateUrl: "usuario/views/estudiante/import.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/estudiantes');
                            alert("You don't have access here");
                        }
                    }
                }
            })

            .when('/profesores', {
                templateUrl: "usuario/views/profesor/list.client.view.html"
            })
            .when('/profesores/create', {
                templateUrl: "usuario/views/profesor/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/profesores');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/profesores/:idusuario', {
                templateUrl: "usuario/views/profesor/read.client.view.html"
            })
            .when('/profesores/:idusuario/edit', {
                templateUrl: "usuario/views/profesor/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/profesores');
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