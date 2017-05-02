angular.module('local').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/locales', {
                templateUrl: "local/views/list.client.view.html"
            })
            .when('/locales/create', {
                templateUrl: "local/views/create.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/locales');
                            alert("You don't have access here");
                        }
                    }
                }
            })
            .when('/locales/:idlocal', {
                templateUrl: "local/views/read.client.view.html"
            })
            .when('/locales/:idlocal/edit', {
                templateUrl: "local/views/update.client.view.html",
                resolve: {
                    "check": function (Authentication, $location) {
                        if (!Authentication.user) {
                            $location.path('/locales');
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