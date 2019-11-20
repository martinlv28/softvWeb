'use strict';
angular
  .module('softvApp')
  .controller('ModalCancelaFacturaCtrl', function ($uibModalInstance, $uibModal, ContratoMaestroFactory, ngNotify, $rootScope, options) {
    ////funcion de inicializacion del controlador, asigna un valor
    this.$onInit = function () {
      vm.pregunta = options.pregunta;
    }
///Se puede usar para descartar un modal
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
//llama a GetCancelaPagoFacturaMaestro y lanza un mensaje 
    function ok() {
      ContratoMaestroFactory.GetCancelaPagoFacturaMaestro(options.Clv_Pago).then(function (response) {
        $rootScope.$emit('reload', options.contrato);
        $uibModalInstance.dismiss('cancel');
        ngNotify.set('La factura se ha cancelado correctamente', 'success')
      });
    }

    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    vm.titulo = "Atención ";
  });
