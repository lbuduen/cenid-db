angular.module('local').controller('LocalController', ['$scope', '$routeParams', '$location', '$filter', '$mdToast', '$mdDialog', 'NgTableParams', 'Locales', 'pag_per_page', 'Authentication',
    function ($scope, $routeParams, $location, $filter, $mdToast, $mdDialog, NgTableParams, Locales, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        var self = this;

        $scope.capacidad_total = 0;

        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { nombre: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Locales.query({
                        page: params.page(),
                        per_page: params.count(),
                    }).$promise.then(function (data) {
                        if (data.length) {
                            $scope.capacidad_total = data.map(function (obj) {
                                var objs = [];
                                if (obj.disponibilidad) {
                                    objs.push(obj.capacidad);
                                }
                                return objs;
                            }).reduce(function (previousValue, currentValue) {
                                return parseInt(previousValue) + parseInt(currentValue);
                            });
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
                var local = new Locales({
                    ubicacion: this.ubicacion,
                    capacidad: this.capacidad,
                    disponibilidad: this.disponibilidad
                });

                local.$save(
                    function (res) {
                        $location.path('locales/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('locales');
            }
        };

        $scope.find = function () {
            $scope.niveles = Niveles.query();
        };

        $scope.findOne = function () {
            $scope.local = Locales.get({
                idlocal: $routeParams.idlocal
            }, function (res) {
                // body...
            }, function (errRes) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este local')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(errRes);
                $location.path('locales');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.local.$update(
                    function () {
                        $location.path('locales/' + $scope.local.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('locales');
            }
        };

        $scope.remove = function (local) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar local')
                    .textContent('¿Desea eliminar permanentemente los datos de este local?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (local) {
                        local.$remove(function () {
                            for (var i in $scope.locales) {
                                if ($scope.locales[i] === local) {
                                    $scope.locales.splice(i, 1);
                                }
                            }
                        });
                    }
                    else {
                        $scope.local.$remove(function () {
                            $location.path('locales');
                        });
                    }
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('locales');
            }
        };

        function del(local) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar local')
                    .textContent('¿Desea eliminar permanentemente los datos de este local?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (local) {
                        local.$remove(function () {
                            _.remove(self.tableParams.data, function (item) {
                                return local === item;
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
                $location.path('locales');
            }
        }
    }
]);