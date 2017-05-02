angular.module('search').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/search', {
            controller: 'SideBarController',
            templateUrl: "search/views/search.view.html"            
        })
        .otherwise({
            redirectTo: "/"
        });
    }
]);