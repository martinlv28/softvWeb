'use strict';
angular.module('softvApp').controller('DetalleCtrl', DetalleCtrl);

function DetalleCtrl($uibModal, ngNotify, inMenu, $uibModalInstance, x, pagosMaestrosFactory) {
	//funcion de inicializacion del controlador, llama a dameDetalleFactura
	function initial() {
		pagosMaestrosFactory.dameDetalleFactura(x.Clv_FacturaMaestro).then(function (data) {
			vm.detalles = data.GetDameDetalle_FacturaMaestroListResult;
			
		});
	}
	//Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}

	var vm = this;
	vm.cancel = cancel;
	vm.ticket = x.Ticket;
	initial();
}