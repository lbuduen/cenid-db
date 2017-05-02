angular.module('curso').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/cursos', {
                templateUrl: "curso/views/list.client.view.html"
            })
            .when('/cursos/:idcurso/add/profesor', {
                templateUrl: "curso/views/curso-profesor.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {    
                            $location.path('/cursos'); 
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/cursos/:idcurso/add/grupo', {
                templateUrl: "curso/views/curso-grupo.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {    
                            $location.path('/cursos'); 
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/cursos/create', {
                templateUrl: "curso/views/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {    
                            $location.path('/cursos'); 
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/cursos/:idcurso', {
                templateUrl: "curso/views/read.client.view.html"
            })
            .when('/cursos/:idcurso/edit', {
                templateUrl: "curso/views/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {    
                            $location.path('/cursos'); 
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