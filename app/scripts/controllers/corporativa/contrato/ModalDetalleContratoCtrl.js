'use strict';
angular
	.module('softvApp')
	.controller('ModalDetalleContratoCtrl', function($uibModalInstance, $uibModal, ContratoMaestroFactory, $rootScope, ngNotify, contrato, corporativoFactory) {
		//funcion de inicializacion del controlador, llama a la funcion singleContrato de corporativoFactory
		this.$onInit = function() {
			vm.contrato = contrato;
			corporativoFactory.singleContrato(vm.contrato.IdContratoMaestro).then(function(data) {
				vm.contrato = data.GetRelContratosResult[0];
			});
			
		}
//Se puede usar para descartar un modal
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		var vm = this;
		vm.cancel = cancel;
	});
