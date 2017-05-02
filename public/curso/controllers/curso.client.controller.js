angular.module('curso').controller('CursoController', ['$scope', '$http', '$element', '$mdToast', '$mdDialog', '$routeParams', '$location', '$filter', 'NgTableParams', 'Cursos', 'Profesores', 'Grupos', 'pag_per_page', 'Authentication',
    function ($scope, $http, $element, $mdToast, $mdDialog, $routeParams, $location, $filter, NgTableParams, Cursos, Profesores, Grupos, pag_per_page, Authentication) {

        $scope.authentication = Authentication;

        $scope.fecha_inicio = new Date();
        $scope.fecha_fin = new Date($scope.fecha_inicio.getFullYear(), $scope.fecha_inicio.getMonth() + 3, $scope.fecha_inicio.getDate());

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { nombre: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Cursos.query({
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
                var curso = new Cursos({
                    titulo: this.titulo,
                    descripcion: this.descripcion,
                    fecha_inicio: this.fecha_inicio,
                    fecha_fin: this.fecha_fin
                });

                curso.$save(
                    function (res) {
                        $location.path('cursos/' + res.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data.message;
                    }
                );
            }
            else {
                $location.path('cursos');
            }
        };

        $scope.find = function () {
            $scope.cursos = Cursos.query();
        };

        $scope.findOne = function () {
            var curso = Cursos.get({
                idcurso: $routeParams.idcurso
            }).$promise.then(function (cur) {
                $scope.curso = cur;
                $scope.curso.fecha_inicio = new Date(cur.fecha_inicio);
                $scope.curso.fecha_fin = new Date(cur.fecha_fin);
            }, function (error) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este curso')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(error);
                $location.path('cursos');
            });
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.curso.$update(
                    function () {
                        $location.path('cursos/' + $scope.curso.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('cursos');
            }
        };

        $scope.remove = function (curso) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar curso')
                    .textContent('¿Desea eliminar permanentemente los datos de este curso?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (curso) {
                        curso.$remove(function () {
                            for (var i in $scope.cursos) {
                                if ($scope.cursos[i] === curso) {
                                    $scope.cursos.splice(i, 1);
                                }
                            }
                        });
                    }
                    else {
                        $scope.curso.$remove(function () {
                            $location.path('cursos');
                        });
                    }
                }, function () {
                    // $location.path('locales');
                });
            }
            else {
                $location.path('cursos');
            }
        };

        function del(curso) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar curso')
                    .textContent('¿Desea eliminar permanentemente los datos de este curso?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (curso) {
                        curso.$remove(function () {
                            _.remove(self.tableParams.data, function (item) {
                                return curso === item;
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
                $location.path('cursos');
            }
        }

        $scope.getProfesores = function () {
            Profesores.query().$promise.then(function (profesors) {
                profesors.forEach(function (prof) {
                    prof.checked = false;
                    if (_.find($scope.curso.Profesors, o => o.id == prof.idprofesor))
                        prof.checked = true;
                });
                $scope.selectProfesores = profesors;
            });
        };

        $scope.getGrupos = function () {
            Grupos.query().$promise.then(function (grupos) {
                grupos.forEach(function (g) {
                    g.checked = false;
                    if (_.find($scope.curso.Grupos, o => o.id == g.id))
                        g.checked = true;
                });
                $scope.selectGrupos = grupos;
            });
        };

        $scope.asignarProfesor = function () {
            if ($scope.authentication.user) {
                $scope.searchTerm = '';

                if (this.profesores) {
                    var url = '/api/cursos/' + $routeParams.idcurso + '/add/profesor';
                    $http.post(url, { profesores: this.profesores }).then(
                        function (response) {
                            var msg = $mdToast.simple()
                                .textContent('Los profesores han sido asociados al curso correctamente')
                                .position('top right')
                                .hideDelay(3000);
                            $mdToast.show(msg);
                        },
                        function (response) {
                            // body...
                        });
                }
            }
            else {
                $location.path('cursos');
            }
        };

        $scope.asignarGrupo = function () {
            if ($scope.authentication.user) {
                $scope.searchGrupo = '';
                var url = '/api/cursos/' + $routeParams.idcurso + '/add/grupo';
                $http.post(url, { grupos: this.grupos }).then(
                    function (res) {
                        var msg = $mdToast.simple()
                            .textContent('Los grupos han sido asociados al curso correctamente')
                            .position('top right')
                            .hideDelay(3000);
                        $mdToast.show(msg);
                    },
                    function (err) {
                        // body...
                    });
            }
            else {
                $location.path('cursos');
            }
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });
    }
]);