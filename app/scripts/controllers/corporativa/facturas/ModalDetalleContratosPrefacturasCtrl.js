(function () {
    'use strict';

    angular
        .module('softvApp')
        .controller('ModalDetalleContratosPrefacturasCtrl', ModalDetalleContratosPrefacturasCtrl);

    ModalDetalleContratosPrefacturasCtrl.inject = ['$uibModalInstance', '$uibModal', '$rootScope', 'ngNotify', 'ContratoMaestroFactory', 'ticket'];

    function ModalDetalleContratosPrefacturasCtrl($uibModalInstance, $uibModal, $rootScope, ngNotify, ContratoMaestroFactory, ticket) {
        var vm = this;
        vm.cancel = cancel;
        vm.ok = ok;
        vm.DescargarExcel = DescargarExcel;
        vm.csvheader=['Contrato','Servicio','PeriodoFactura','ImporteTotal','Contratacion','Mensualidad','CambioPaquete','IP','Token','Diferencia','Bonificacion'];
        vm.csvorder=['Contrato','Servicio','PeriodoFactura','ImporteTotal','Contratacion','Mensualidad','CambioServicio','IP','Token','Diferencia','Bonificacion'];
        //funcion de inicializacion del controlador, obtiene los detalles de contratos prefacturas 
        this.$onInit = function () {
            vm.Ticket = ticket;
            ContratoMaestroFactory.GetDetalleContratoPrefactura(ticket.Clv_FacturaMaestro).then(function (data) {
                //console.log('Detalles', data);
                vm.DetallesFactura = data.GetDetalleContratoPrefacturaResult.Detalles;
                vm.DetallesFactura.forEach(function (item, index) {
                    //item.
                });
                vm.Total = data.GetDetalleContratoPrefacturaResult.Total;
            });
        };
//Se puede usar para descartar un modal
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
//NA
        function ok() {

        }
//NA
        function DescargarExcel(){

        }

    }
})();
