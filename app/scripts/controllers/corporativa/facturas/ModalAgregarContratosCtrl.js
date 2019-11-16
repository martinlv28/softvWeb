(function () {
    'use strict';

    angular
        .module('softvApp')
        .controller('ModalAgregarContratosCtrl', ModalAgregarContratosCtrl);

    ModalAgregarContratosCtrl.inject = ['$uibModalInstance', '$uibModal', '$rootScope', 'ngNotify', 'ContratoMaestroFactory', 'FacturaMaestro','$localStorage'];

    function ModalAgregarContratosCtrl($uibModalInstance, $uibModal, $rootScope, ngNotify, ContratoMaestroFactory, FacturaMaestro, $localStorage) {
        var vm = this;
        vm.cancel = cancel;
        vm.ok = ok;
        vm.ContratosSeleccionados = [];
        vm.AgregarContrato = AgregarContrato;
        vm.QuitarContrato = QuitarContrato;
        vm.Aceptar = Aceptar;

        vm.ContratosSeleccionados2 = [];
        vm.AgregarContrato2 = AgregarContrato2;
        vm.QuitarContrato2 = QuitarContrato2;
        vm.Aceptar2 = Aceptar2;
        vm.Meses = 1;

//valida que este seleccionado al menos un contrato, donde si es el caso agrega contratos factura preliminar 
        function Aceptar() {
            if (vm.ContratosSeleccionados.length == 0) {
                ngNotify.set('Es necesario seleccionar al menos un contrato.', 'warn');
            }
            else {
                var parametros = {};
                parametros.Clv_FacturaMaestro = FacturaMaestro.Clv_FacturaMaestro;
                parametros.Contratos = vm.ContratosSeleccionados;
                parametros.Meses = vm.Meses;
                parametros.Usuario = $localStorage.currentUser.usuario;
                ContratoMaestroFactory.GetAgregaContratosFacturaPreliminar(parametros).then(function (data) {
                    ngNotify.set('Factura Preliminar editada exitosamente.', 'success');
                    $uibModalInstance.close();
                });
            }
        }
//valida que este seleccionado al menos un contrato, donde si es el caso elinima contratos factura preliminar 
            if (vm.ContratosSeleccionados2.length == 0) {
                ngNotify.set('Es necesario seleccionar al menos un contrato.', 'warn');
            }
            else {
                var parametros = {};
                parametros.Clv_FacturaMaestro = FacturaMaestro.Clv_FacturaMaestro;
                parametros.Contratos = vm.ContratosSeleccionados2;
                parametros.Usuario = $localStorage.currentUser.usuario;
                ContratoMaestroFactory.GetEliminaContratosFacturaPreliminar(parametros).then(function (data) {
                    ngNotify.set('Factura Preliminar editada exitosamente.', 'success');
                    $uibModalInstance.close();
                });
            }
        }
//Busca e contrato y lo quita de la lista 
        function QuitarContrato(Contrato) {
            vm.displayCollection.push(Contrato);
            var indexAux = 0;
            vm.ContratosSeleccionados.forEach(function (item, index) {
                if (Contrato.Contrato == item.Contrato) {
                    indexAux = index;
                }
            });
            vm.ContratosSeleccionados.splice(indexAux, 1);
        }
//Busca e contrato y lo quita de la lista 
        function QuitarContrato2(Contrato) {
            vm.displayCollection2.push(Contrato);
            var indexAux = 0;
            vm.ContratosSeleccionados2.forEach(function (item, index) {
                if (Contrato.Contrato == item.Contrato) {
                    indexAux = index;
                }
            });
            vm.ContratosSeleccionados2.splice(indexAux, 1);
        }
//Busca e contrato y lo quita de la lista 
        function AgregarContrato(Contrato) {
            vm.ContratosSeleccionados.push(Contrato);
            var indexAux = 0;
            vm.displayCollection.forEach(function (item, index) {
                if (Contrato.Contrato == item.Contrato) {
                    indexAux = index;
                }
            });
            vm.displayCollection.splice(indexAux, 1);
        }
Busca e contrato y lo quita de la lista 
        function AgregarContrato2(Contrato) {
            vm.ContratosSeleccionados2.push(Contrato);
            var indexAux = 0;
            vm.displayCollection2.forEach(function (item, index) {
                if (Contrato.Contrato == item.Contrato) {
                    indexAux = index;
                }
            });
            vm.displayCollection2.splice(indexAux, 1);
        }
//funcion de inicializacion del controlador, obtiene los contratos preliminar 
        this.$onInit = function () {
            vm.Clv_FacturaMaestro = FacturaMaestro.Clv_FacturaMaestro;
            var parametros = {};
            parametros.Clv_FacturaMaestro = FacturaMaestro.Clv_FacturaMaestro;
            ContratoMaestroFactory.GetObtieneContratosNoFacturaPreliminar(parametros).then(function (data) {
                vm.contratosLigados = data.GetObtieneContratosNoFacturaPreliminarResult;
                vm.displayCollection = data.GetObtieneContratosNoFacturaPreliminarResult;
                ContratoMaestroFactory.GetObtieneContratosFacturaPreliminar(parametros).then(function (data) {
                    vm.contratosFactura = data.GetObtieneContratosFacturaPreliminarResult;
                    vm.displayCollection2 = data.GetObtieneContratosFacturaPreliminarResult;
                });
            });
        };
////Se puede usar para descartar un modal
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
//NA
        function ok() {

        }

    }
})();
