angular.module('usuario').controller('EstudianteController', ['$scope', '$routeParams', '$http', '$location', '$filter', '$mdToast', '$mdDialog', 'NgTableParams', 'Estudiantes', 'Niveles', 'pag_per_page', 'Authentication',
    function ($scope, $routeParams, $http, $location, $filter, $mdToast, $mdDialog, NgTableParams, Estudiantes, Niveles, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { apellidos: "asc" },
            // filter: { area: "CHJA" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Estudiantes.query({
                        page: params.page(),
                        per_page: params.count(),
                    }).$promise.then(function (data) {
                        if (data.length) {
                            params.total(data[0].total); // recal. page nav controls
                            // use build-in angular filter
                            var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;

                            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                            return orderedData;
                        }
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
                    nivel_diagnosticado: this.nivel_diagnosticado,
                    nivel_acreditado: this.nivel_acreditado,
                    observaciones: this.observaciones
                };

                var usr = new Estudiantes(atribs);

                usr.$save(
                    function (res) {
                        $location.path('estudiantes/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('estudiantes');
            }
        };

        $scope.findOne = function () {
            $scope.usuario = Estudiantes.get({
                id: $routeParams.idusuario
            }, function (res) {
                // body...
            }, function (errRes) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este estudiante')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(errRes);
                $location.path('estudiantes');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.usuario.$update(
                    function () {
                        $location.path('estudiantes/' + $scope.usuario.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('estudiantes');
            }
        };

        function del(usr) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar estudiante')
                    .textContent('¿Desea eliminar permanentemente los datos de este estudiante?')
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
                $location.path('estudiantes');
            }
        };

        $scope.remove = function () {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar estudiante')
                    .textContent('¿Desea eliminar permanentemente los datos de este estudiante?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    $scope.usuario.$remove(function () {
                        $location.path('estudiantes');
                    });
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('estudiantes');
            }
        };

        $scope.importCSV = function (element) {
            if ($scope.authentication.user) {
                $scope.$apply(function ($scope) {
                    $scope.files = element.files;
                });
                var fd = new FormData();
                fd.append('csv', $scope.files[0]);

                var url = '/api/estudiantes/import/csv';
                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function (res) {
                    $location.path('estudiantes');
                    var msg = $mdToast.simple()
                        .textContent('La operación se completó correctamente')
                        .highlightAction(true)
                        .position('top right')
                        .hideDelay(10000);
                    $mdToast.show(msg).then(function (response) {
                        if (response == 'ok') {
                            alert('You clicked the \'UNDO\' action.');
                        }
                    });
                }, function (error) {
                    alert("error");
                });
            }
            else {
                $location.path('estudiantes');
            }
        };

        $scope.getAreas = function () {
            $http.get('/api/estudiantes/get/areas').then(
                resp => {
                    $scope.areas = _.uniq(resp.data);
                    console.log($scope.areas);
                },
                error => {

                });
        };
    }
]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}