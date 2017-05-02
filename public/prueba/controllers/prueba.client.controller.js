angular.module('prueba').controller('PruebaController', ['$scope', '$rootScope', '$element', '$log', '$routeParams', '$mdToast', '$mdDialog', '$location', '$filter', '$http', 'NgTableParams', 'Pruebas', 'Niveles', 'Estudiantes', 'Locales', 'pag_per_page', 'Authentication',
    function ($scope, $rootScope, $element, $log, $routeParams, $mdToast, $mdDialog, $location, $filter, $http, NgTableParams, Pruebas, Niveles, Estudiantes, Locales, pag_per_page, Authentication) {
        $scope.authentication = Authentication;

        $scope.fecha = new Date();
        $scope.codigo = Math.random().toString(36).substr(2, 10);

        $rootScope.escala = '';
        $scope.notas = [];
        /*
            keep track of what to display in the read.client.view
            0 - displays "Estado" and "Local"
            1 - displays notas
            2 - displays selects to assess
        */
        $scope.display = 0;

        $scope.estudiantes = [];
        $scope.selected = [];

        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page,
            sorting: { fecha: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Pruebas.query({
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

        self.tableParticipants = new NgTableParams({
            count: pag_per_page,
            sorting: { fecha: "asc" }
        }, {
                // counts: [1,2],
                getData: function (params) {
                    return Estudiantes.query({
                        page: params.page(),
                        per_page: params.count(),
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

        self.del = del;

        $scope.create = function () {
            if ($scope.authentication.user) {
                var total_estudiantes = _.uniq($scope.selected).length;

                if ($scope.locales_prueba && total_estudiantes) {

                    var capacidad_locales = this.locales_prueba.map(function (obj) {
                        var objs = [];
                        objs.push(obj.capacidad);
                        return objs;
                    }).reduce(function (previousValue, currentValue) {
                        return parseInt(previousValue) + parseInt(currentValue);
                    });

                    var proceed = function () {
                        var url = '/api/pruebas/add/estudiantes';
                        $http.post(url, {
                            titulo: $scope.titulo,
                            fecha: $scope.fecha,
                            codigo: $scope.codigo,
                            niveles: $scope.niveles,
                            habilidades: $scope.habilidades,
                            locales: $scope.locales_prueba,
                            estudiantes: _.uniq($scope.selected),
                            shuffle: $scope.shuffle_est
                        }).then(function (res) {
                            var msg = $mdToast.simple()
                                .textContent('La operación se completó correctamente')
                                .action('VER')
                                .highlightAction(true)
                                .position('bottom left')
                                .hideDelay(10000);
                            $mdToast.show(msg).then(function (response) {
                                if (response == 'ok') {
                                    $location.path('pruebas');
                                }
                            });
                        }, function (error) {
                            alert("error");
                        });
                    };

                    if (total_estudiantes > capacidad_locales) {
                        var confirm = $mdDialog.confirm()
                            .title('¡Atención!')
                            .textContent('La cantidad de estudiantes(' + total_estudiantes + ') excede la capacidad total de los locales(' + capacidad_locales + ')')
                            .ok('Aceptar')
                            .cancel('Revisar locales');

                        $mdDialog.show(confirm).then(function () {
                            proceed();
                        }, function () {
                            $location.path('locales');
                        });
                    }
                    else {
                        proceed();
                    }
                }
            }
            else {
                $location.path('pruebas');
            }
        };

        $scope.find = function () {
            Pruebas.query().$promise.then(function (pruebas) {
                $scope.pruebas = pruebas;
                $scope.codigos = _.uniq(pruebas.map(_.property('codigo')));
            });
        };

        $scope.count = 20; // contador para el infinitescroll
        $scope.findOne = function () {
            var prueba = Pruebas.get({
                idprueba: $routeParams.idprueba
            }).$promise.then(function (pr) {
                $scope.prueba = pr;
                $scope.prueba.fecha = new Date(pr.fecha);
                $scope.prueba.niveles_id = $scope.prueba.niveles.map(_.property('idnivel'));
                $scope.estudiantes = pr.Estudiantes;
                /*
                * @var
                * Contiene el subset de los estudiantes de la prueba con los que hago el infinitescroll
                */
                $scope.prueba_estudiantes = $scope.estudiantes.slice(0, $scope.count);
            }, function (error) {
                var msg = $mdToast.simple()
                    .textContent('Se ha producido un error al cargar los datos de este examen')
                    .position('top right')
                    .hideDelay(3000);
                $mdToast.show(msg);
                console.log(error);
                $location.path('pruebas');
            });
        };

        $scope.loadMore = function () {
            if ($scope.count < $scope.estudiantes.length) {
                var len = $scope.count + 10;
                if (len > $scope.estudiantes.length) {
                    len = $scope.estudiantes.length;
                }
                for (var i = $scope.count, ic = 0; i < len; i++ , ic++) {
                    $scope.prueba_estudiantes.push($scope.estudiantes[i]);
                }
                $scope.count += ic;
            }
        };

        $scope.update = function () {
            if ($scope.authentication.user) {
                $scope.prueba.$update(
                    function () {
                        $location.path('pruebas/' + $scope.prueba.id);
                    },
                    function (errRes) {
                        $scope.error = errRes.data;
                    }
                );
            }
            else {
                $location.path('pruebas');
            }
        };

        $scope.remove = function () {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar prueba')
                    .textContent('¿Desea eliminar permanentemente los datos de esta prueba?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm)
                    .then(function () {
                        $scope.prueba.$remove(function () {
                            $location.path('pruebas');
                        });
                    }, function () {
                        // $location.path('locales');
                    });
            }
            else {
                $location.path('pruebas');
            }
        };

        function del(prueba) {
            if ($scope.authentication.user) {
                var confirm = $mdDialog.confirm()
                    .title('Eliminar prueba')
                    .textContent('¿Desea eliminar permanentemente los datos de esta prueba?')
                    .ok('Aceptar')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function () {
                    if (prueba) {
                        $log.debug(prueba);
                        prueba.$remove(function () {
                            _.remove(self.tableParams.data, function (item) {
                                return prueba === item;
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
                $location.path('pruebas');
            }
        };

        $scope.loadNiveles = function () {
            Niveles.query().$promise.then(function (niveles) {
                if ($scope.prueba) {
                    niveles.forEach(function (n) {
                        n.checked = false;
                        if (_.find($scope.prueba.niveles, o => o.id == n.id))
                            n.checked = true;
                    });
                }
                $scope.nivel_select = niveles;
            });
        };

        $scope.loadHabilidades = function () {
            var url = '/api/pruebas/get/habilidades';
            $http.get(url).then(h => {
                $scope.habilidad_select = h.data;
            });
        };

        $scope.findLocales = function () {
            Locales.query().$promise.then(function (locales) {
                $scope.locales = locales;
            });
        };

        $scope.setEscala = function (ev) {
            if ($scope.authentication.user) {
                $scope.loadNiveles();
                $scope.notas = [''];
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'prueba/views/calificar.config.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                })
                    .then(function (answer) {
                        switch ($rootScope.escala) {
                            case 'numerica':
                                $scope.notas = ['', 5, 4, 3, 2];
                                break;
                            case 'grafica':
                                $scope.notas = ['', 'E', 'MB', 'B', 'R', 'M'];
                                break;
                            case 'nivel':
                                $scope.nivel_select.forEach(function (n) {
                                    $scope.notas.push(n.nombre);
                                });
                                break;
                            case 'descriptiva':
                                $scope.notas = ['', 'aprobado', 'no aprobado'];
                                break;
                        }
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            }
            else {
                $location.path('pruebas');
            }
        };

        $scope.calificar = function () {
            if ($scope.authentication.user) {
                var notas = $element.find('select');
                var calificaciones = [];
                for (var i = 0; i < notas.length; i++) {
                    if (notas[i].value != '') {
                        var calificacion = {
                            nota: notas[i].value,
                            habilidad_id: notas[i].attributes['data-habilidad'].value,
                            estudiante_id: notas[i].attributes['data-estudiante'].value,
                            prueba_id: notas[i].attributes['data-prueba'].value
                        };
                        calificaciones.push(calificacion);
                    }
                }
                var url = '/api/pruebas/set/notas';
                $http.post(url, JSON.stringify(calificaciones))
                    .then(function (res) {
                        var msg = $mdToast.simple()
                            .textContent('Las notas han sido registradas correctamente')
                            .highlightAction(true)
                            .position('bottom left')
                            .hideDelay(10000);
                        $mdToast.show(msg).then(function (response) {

                        });
                    }, function (error) {
                        console.log("error");
                    });
            }
            else {
                $location.path('pruebas');
            }
        };

        $scope.download = function () {
            var niveles = $scope.prueba.niveles.map(function (nivel) {
                return nivel.nombre;
            }).join();

            var habilidades = $scope.prueba.habilidades.map(function (h) {
                return h.nombre;
            });

            var table_body = [];
            var header = ['Nombre', 'Email', 'Local', ...habilidades];
            table_body.push(header);
            $scope.estudiantes.forEach(function (est) {
                var row = [est.nombre_completo, est.email, est.ubicacion];
                est.nota.forEach(function (n) {
                    if (n.nota) {
                        row.push(n.nota);
                    }
                    else {
                        row.push('-');
                    }
                });
                table_body.push(row);
            });

            var docDefinition = {
                // header: $scope.prueba.titulo,
                content: [
                    { text: $scope.prueba.titulo, fontSize: 15, bold: true, margin: [0, 0, 0, 10] },
                    { text: 'Fecha: ' + $scope.prueba.fecha.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' }), margin: [0, 0, 0, 10] },
                    { text: 'Niveles: ' + niveles, margin: [0, 0, 0, 10] },
                    { text: 'Habilidades: ' + habilidades.join(), margin: [0, 0, 0, 10] },
                    { text: 'Estudiantes (' + $scope.estudiantes.length + '):', bold: true, margin: [0, 0, 0, 10] },
                    {
                        table: {
                            headerRows: 1,
                            // widths: ['*', 'auto', 100, '*', '*', '*', '*'],

                            body: table_body
                        }
                    }
                ]
            };
            pdfMake.createPdf(docDefinition).download($scope.prueba.titulo + '.pdf');
        };

        $scope.setDisplay = function (status) {
            this.display = status;
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item.idestudiante);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item.idestudiante);
            }
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item.idestudiante) > -1;
        };
        $scope.isIndeterminate = function () {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.estudiantes.length);
        };
        $scope.isChecked = function () {
            return $scope.selected.length === $scope.estudiantes.length;
        };
        $scope.toggleAll = function () {
            if ($scope.selected.length === $scope.estudiantes.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.estudiantes.slice(0);
            }
        };

        $scope.countSelected = function () {
            return _.uniq($scope.selected).length;
        }
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