(function () {
  'use strict';

  angular
    .module('softvApp')
    .controller('modalRevertirProcesoCtrl', modalRevertirProcesoCtrl);

  modalRevertirProcesoCtrl.inject = ['$uibModalInstance', '$uibModal', '$rootScope', 'ngNotify', 'ContratoMaestroFactory', 'options'];

  function modalRevertirProcesoCtrl($uibModalInstance, $uibModal, $rootScope, ngNotify, ContratoMaestroFactory, options) {
    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
//Se puede usar para descartar un modal, envia el evento 

    function cancel() {
      $uibModalInstance.dismiss('cancel');
      $rootScope.$broadcast('verticket', options);
    }
//llama al procedimiento cancelar 
    function ok() {

      ContratoMaestroFactory.GetProcedimientoCancelar(options.clvnota).then(function (data) {
        $uibModalInstance.dismiss('cancel');
        $rootScope.$broadcast('verticket', options);
        ngNotify.set(data.GetProcedimientoCancelarResult[0].Msg, 'success');
      });
    }


  }
})();
