angular.module('nivel').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/niveles', {
                templateUrl: "nivel/views/list.client.view.html"
            })
            .when('/niveles/create', {
                templateUrl: "nivel/views/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/niveles');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/niveles/:idnivel', {
                templateUrl: "nivel/views/read.client.view.html"
            })
            .when('/niveles/:idnivel/edit', {
                templateUrl: "nivel/views/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/niveles');
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