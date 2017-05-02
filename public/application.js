var mainApplicationModuleName = 'cenid';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
    'ngMaterial',
    'ngResource',
    'ngRoute',
    'ngMessages',
    'ngTable',
    'ngTableToCsv',
    'usuario', 'curso', 'grupo', 'nivel', 'prueba', 'local', 'search'
]);

mainApplicationModule.config(['$locationProvider',
    function ($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);
if (window.location.hash === '#_=_') window.location.hash = '#!';

mainApplicationModule.constant('pag_per_page', 20);

mainApplicationModule.controller('SideBarController', ['$scope', '$mdSidenav', '$location', 'SearchService',
    function ($scope, $mdSidenav, $location, SearchService) {
        $scope.openRightMenu = function () {
            $mdSidenav('right').toggle();
        };

        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    // $log.debug("close RIGHT is done");
                });
        };
        $scope.search = function () {
            SearchService.search(this.q).then(
                function (res) {
                    $scope.search_result = res.data;
                    $location.path('search');
                },
                function (error) {
                    console.log(error);
                });
        };
    }
]);

mainApplicationModule.filter('estado_prueba', function () {
    return function (estado) {
        var str = '';
        switch (estado) {
            case 1:
                str = "Aceptada";
                break;
            case 2:
                str = "Completada";
                break;
            default:
                str = "Solicitada";
                break;
        }
        return str;
    }
});

mainApplicationModule.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

angular.element(document).ready(function () {
    angular.bootstrap(document, [mainApplicationModuleName]);
});