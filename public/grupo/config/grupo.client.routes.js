angular.module('grupo').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/grupos', {
                templateUrl: "grupo/views/list.client.view.html"
            })
            .when('/grupos/create', {
                templateUrl: "grupo/views/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/grupos');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/grupos/:idgrupo', {
                templateUrl: "grupo/views/read.client.view.html"
            })
            .when('/grupos/:idgrupo/edit', {
                templateUrl: "grupo/views/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {    
                            $location.path('/grupos'); 
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