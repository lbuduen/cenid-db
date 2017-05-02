angular.module('usuario').controller('UsuarioController', ['$scope', '$routeParams', '$location', '$filter', 'NgTableParams', 'Usuarios', 'Niveles', 'pag_per_page',
    function ($scope, $routeParams, $location, $filter, NgTableParams, Usuarios, Niveles, pag_per_page) {
        
        var self = this;
        self.tableParams = new NgTableParams({
            count: pag_per_page, 
            sorting: { apellidos: "asc" } 
        }, {
            // counts: [1,2],
            getData: function(params) {
                return Usuarios.query({
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

        $scope.tipo = 'estudiante';

        $scope.get_niveles = function (para) {
            switch (para) {
                case 'a':
                    $scope.aniveles = Niveles.query();
                break;
                case 'd':
                    $scope.dniveles = Niveles.query();
                break
            }
        };

        $scope.create = function () {
            var atribs = {
                nombre: this.nombre,
                apellidos: this.apellidos,
                email: this.email,
                area: this.area,
                clave: this.clave
            };
            if (this.tipo = 'estudiante') {
                atribs.tipo = this.tipo;
                atribs.nivel_diagnosticado = this.nivel_diagnosticado;
                atribs.nivel_acreditado = this.nivel_acreditado;
                atribs.observaciones = this.observaciones;
            }
            if (this.tipo = 'profesor') {
                atribs.tipo = this.tipo;
                atribs.curriculum = this.curriculum;
            }
            var usr = new Usuarios(atribs);
            var that = this;

            usr.$save(
                function (res) {
                    if (that.tipo = 'estudiante') {
                        $location.path('estudiantes/' + res.id);
                    }
                    if (that.tipo = 'profesor') {
                        $location.path('profesores/' + res.id);
                    }
                },
                function (errRes) {
                    $scope.error = errRes.data.message;
                }
            );
        };

        $scope.find = function () {
            $scope.usuarios = Usuarios.query();
        };

        $scope.findOne = function (tipo) {
            if (tipo = 'estudiante') {
                $scope.usuario = Usuarios.getEstudiante({
                    id: $routeParams.idusuario
                });
            }
            if (tipo = 'profesor') {
                $scope.usuario = Usuarios.getProfesor({
                    id: $routeParams.idusuario
                });
            }
        };

        $scope.update = function () {
            $scope.usuario.$update(
                function () {
                    $location.path('usuarios/' + $scope.usuario.id)
                },
                function (errRes) {
                    $scope.error = errRes.data;
                }
            );
        };

        function del(usr) {
            if (usr) {
                usr.$remove(function () {
                    _.remove(self.tableParams.data, function(item) {
                           return usr === item;
                     });
                     self.tableParams.reload().then(function(data) {
                       if (data.length === 0 && self.tableParams.total() > 0) {
                         self.tableParams.page(self.tableParams.page() - 1);
                         self.tableParams.reload();
                       }
                     });
                });
            }
        }

        $scope.remove = function () {
            $scope.usuario.$remove(function () {
                $location.path('usuarios');
            });
        };
    }
]);