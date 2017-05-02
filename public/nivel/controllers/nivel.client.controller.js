angular.module('nivel').controller('NivelController', ['$scope', '$routeParams', '$location', '$filter', '$mdToast', '$mdDialog', 'NgTableParams', 'Niveles', 'pag_per_page', 'Authentication',
    function ($scope, $routeParams, $location, $filter, $mdToast, $mdDialog, NgTableParams, Niveles, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { nombre: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Niveles.query({
                        page: params.page(),
                        per_page: params.count(),
                    }).$promise.then(function (data) {
                        if (data.length) {
                            params.total(data[0].total); // recal. page nav controls
                            var ordered = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            return ordered;
                        }
                    });
                }
            });
        self.del = del;

        $scope.create = function () {
            if ($scope.authentication.user) {
                var nivel = new Niveles({
                    nombre: this.nombre,
                    descripcion: this.descripcion
                });

                nivel.$save(
                    function (res) {
                        $location.path('niveles/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('niveles');
            }
        };

        $scope.find = function () {
            $scope.niveles = Niveles.query();
        };

        $scope.findOne = function () {
            $scope.nivel = Niveles.get({
                idnivel: $routeParams.idnivel
            }, function (res) {
                // body...
            }, function (errRes) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este nivel')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(errRes);
                $location.path('niveles');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.nivel.$update(
                    function () {
                        $location.path('niveles/' + $scope.nivel.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('niveles');
            }
        };

        $scope.remove = function (nivel) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar nivel')
                    .textContent('¿Desea eliminar permanentemente los datos de este nivel?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (nivel) {
                        nivel.$remove(function () {
                            for (var i in $scope.niveles) {
                                if ($scope.niveles[i] === nivel) {
                                    $scope.niveles.splice(i, 1);
                                }
                            }
                        });
                    }
                    else {
                        $scope.nivel.$remove(function () {
                            $location.path('niveles');
                        });
                    }
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('niveles');
            }
        };

        function del(nivel) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar nivel')
                    .textContent('¿Desea eliminar permanentemente los datos de este nivel?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (nivel) {
                        nivel.$remove(function () {
                            _.remove(self.tableParams.data, function (item) {
                                return nivel === item;
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
                $location.path('niveles');
            }
        }
    }
]);