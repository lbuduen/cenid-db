angular.module('grupo').controller('GrupoController', ['$scope', '$rootScope', '$http', '$routeParams', '$location', '$filter', 'NgTableParams', '$mdDialog', '$mdToast', 'Grupos', 'Estudiantes', 'pag_per_page', 'Authentication',
    function ($scope, $rootScope, $http, $routeParams, $location, $filter, NgTableParams, $mdDialog, $mdToast, Grupos, Estudiantes, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        $scope.estudiantes = [];
        $scope.estudiantes_grupo = [];
        $rootScope.estudiantes_grupo_edit = [];
        $rootScope.listado = [];
        $scope.mode = 'read';

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { apellidos: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Estudiantes.query({
                        page: params.page(),
                        per_page: params.count(),
                        grupo: true
                    }).$promise.then(function (data) {
                        if (data.length) {
                            data.forEach(elem => {
                                $scope.estudiantes.push(elem.idestudiante);
                            });
                            params.total(data[0].total); // recal. page nav controls
                            var ordered = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            return ordered;
                        }
                    });
                }
            });

        $scope.create = function () {
            if ($scope.authentication.user) {
                var grupo = new Grupos({
                    nombre: this.nombre,
                    estudiantes: this.estudiantes_grupo
                });

                grupo.$save(
                    function (res) {
                        $location.path('grupos/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('grupos');
            }
        };

        $scope.find = function () {
            $scope.grupos = Grupos.query();
        };

        $scope.findOne = function () {
            $scope.grupo = Grupos.get({
                idgrupo: $routeParams.idgrupo
            }, function (res) {
                // body...
            }, function (errRes) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este grupo')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(errRes);
                $location.path('grupos');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.grupo.$update(
                    function () {
                        var msg = $mdToast.simple()
                            .textContent('El grupo ha sido editado correctamente')
                            .position('top right')
                            .hideDelay(3000);
                        $mdToast.show(msg);
                        $scope.mode = 'read';
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('grupos');
            }
        };

        $scope.remove = function (grupo) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar grupo')
                    .textContent('¿Desea eliminar permanentemente los datos de este grupo?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (grupo) {
                        grupo.$remove(function () {
                            for (var i in $scope.grupos) {
                                if ($scope.grupos[i] === grupo) {
                                    $scope.grupos.splice(i, 1);
                                }
                            }
                        });
                    }
                    else {
                        $scope.grupo.$remove(function () {
                            $location.path('grupos');
                        });
                    }
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('grupos');
            }
        };

        $scope.removeEstudiante = function (index, id, event) {
            if ($scope.authentication.user) {
                if ($scope.grupo.Estudiantes.length > 1) {
                    $scope.grupo.$removeEstudiante({ idestudiante: id }, function () {
                        $scope.grupo.Estudiantes.splice(index, 1);
                    });
                }
                else {
                    var confirm = $mdDialog.confirm()
                        .title('¿Eliminar estudiante?')
                        .textContent('Si elimina todos los estudiantes del grupo, se eliminará también el grupo')
                        .ariaLabel('Eliminar estudiante')
                        .targetEvent(event)
                        .ok('Eliminar')
                        .cancel('Cancelar');
                    $mdDialog.show(confirm).then(function () {
                        $scope.remove();
                    }, function () {
                        // body...
                    });
                }
            }
            else {
                $location.path('grupos');
            }
        };

        $scope.addEstudiante = function (evt) {
            if ($scope.authentication.user) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'grupo/views/add-estudiante.view.html',
                    parent: angular.element(document.body),
                    targetEvent: evt,
                    clickOutsideToClose: true
                    // fullscreen: useFullScreen
                })
                    .then(answer => {
                        if (answer == 'add') {
                            var url = '/api/grupos/' + $scope.grupo.id;
                            $http.put(url, { nombre: $scope.grupo.nombre, estudiantes: $rootScope.estudiantes_grupo_edit })
                                .then(function (res) {
                                    $rootScope.listado.forEach(elem => {
                                        $scope.grupo.Estudiantes.push(elem);
                                    });

                                    var msg = $mdToast.simple()
                                        .textContent('Se ha(n) añadido ' + $rootScope.estudiantes_grupo_edit.length + ' estudiante(s) al grupo')
                                        .position('top right')
                                        .hideDelay(3000);
                                    $mdToast.show(msg);
                                }, function (errRes) {

                                });
                        }
                    }, function () {
                        console.log('u cancelled the dialog');
                    });
            }
            else {
                $location.path('grupos');
            }
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item.idestudiante);
            if (idx > -1) {
                list.splice(idx, 1);
                $rootScope.listado.splice(idx, 1);
            }
            else {
                list.push(item.idestudiante);
                var usr = { Usuario: item.toJSON() };
                $rootScope.listado.push(usr);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item.idestudiante) > -1;
        };

        $scope.isIndeterminate = function () {
            return ($scope.estudiantes_grupo.length !== 0 && $scope.estudiantes_grupo.length !== $scope.estudiantes.length);
        };

        $scope.isChecked = function () {
            return $scope.estudiantes_grupo.length === $scope.estudiantes.length;
        };

        $scope.toggleAll = function () {
            if ($scope.estudiantes_grupo.length === $scope.estudiantes.length) {
                $scope.estudiantes_grupo = [];
            } else if ($scope.estudiantes_grupo.length === 0 || $scope.estudiantes_grupo.length > 0) {
                $scope.estudiantes_grupo = $scope.estudiantes.slice(0);
            }
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