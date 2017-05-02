angular.module('usuario').controller('ProfesorController', ['$scope', '$routeParams', '$location', '$filter', '$mdToast', '$mdDialog', 'NgTableParams', 'Profesores', 'pag_per_page', 'Authentication',
    function ($scope, $routeParams, $location, $filter, $mdToast, $mdDialog, NgTableParams, Profesores, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { apellidos: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Profesores.query({
                        page: params.page(),
                        per_page: params.count(),
                    }).$promise.then(function (data) {
                        params.total(data[0].total); // recal. page nav controls
                        var ordered = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                        return ordered;
                    });
                }
            });
        self.del = del;

        $scope.get_niveles = function () {
            $scope.aniveles = Niveles.query();
            $scope.dniveles = Niveles.query();
        };

        $scope.create = function () {
            if ($scope.authentication.user) {
                var atribs = {
                    nombre: this.nombre,
                    apellidos: this.apellidos,
                    email: this.email,
                    area: this.area,
                    clave: this.clave,
                    curriculum: this.curriculum
                };

                var usr = new Profesores(atribs);

                usr.$save(
                    function (res) {
                        $location.path('profesores/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('profesores');
            }
        };

        $scope.findOne = function () {
            $scope.usuario = Profesores.get({
                id: $routeParams.idusuario
            }, function (res) {
                // body...
            }, function (errRes) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este profe')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(errRes);
                $location.path('profesores');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.usuario.$update(
                    function () {
                        $location.path('profesores/' + $scope.usuario.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('profesores');
            }
        };

        function del(usr) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar profesor')
                    .textContent('¿Desea eliminar permanentemente los datos de este profesor?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (usr) {
                        usr.$delete(function () {
                            _.remove(self.tableParams.data, function (item) {
                                return usr === item;
                            });
                            self.tableParams.reload().then(function (data) {
                                if (data.length === 0 && self.tableParams.total() > 0) {
                                    self.tableParams.page(self.tableParams.page() - 1);
                                    self.tableParams.reload();
                                }
                            });
                        });
                    }
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('profesores');
            }
        }

        $scope.remove = function () {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar profesor')
                    .textContent('¿Desea eliminar permanentemente los datos de este profesor?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    $scope.usuario.$remove(function () {
                        $location.path('profesores');
                    });
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('profesores');
            }
        };
    }
]);