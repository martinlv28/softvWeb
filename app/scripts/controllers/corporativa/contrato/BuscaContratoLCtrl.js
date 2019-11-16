'use strict';

function BuscaContratoLCtrl($uibModalInstance, atencionFactory, $rootScope, corporativoFactory, ngNotify, contratos) {
	//Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}
	//funcion de inicializacion del controlador, asigna valores a variables y llama a buscarCliente
	this.$onInit = function() {
		var obje = {};
		obje.servicio = 3;
		obje.op = 3;
		obje.colonia = 0;
		vm.distribuidor = contratos.Distribuidor.Clv_Plaza;
		obje.IdDistribuidor = contratos.Distribuidor.Clv_Plaza;
		corporativoFactory.buscarCliente(obje).then(function(data) {
			vm.Clientes = data.GetBuscaByIdDisListResult;
		});
	}
//valida que haya un contrato y despues llama a la funcion buscarCliente
	function BusquedaporContrato() {
		if (vm.BUcontrato == null) {
			ngNotify.set('Ingresa un contrato válido', 'error');
			return;
		}
		var obje = {};
		obje.contrato = vm.BUcontrato;
		obje.servicio = 3;
		obje.colonia = 0;
		obje.IdDistribuidor = vm.distribuidor;
		obje.op = 0;
		corporativoFactory.buscarCliente(obje).then(function(data) {
			
			vm.Clientes = data.GetBuscaByIdDisListResult;
		});
	}
//valida que haya un nombre y despues llama a la funcion buscarCliente
	function BusquedaporNombre() {
		if (vm.BUnombre == null && vm.BUapaterno == null && vm.BUamaterno == null) {
			ngNotify.set('Ingresa por lo menos un parametro de búsqueda', 'error');
			return;
		}
		var obje = {};
		obje.nombre = vm.BUnombre;
		obje.paterno = vm.BUapaterno;
		obje.materno = vm.BUamaterno;
		obje.colonia = 0;
		obje.servicio = 3;
		obje.op = 1;
		obje.IdDistribuidor = vm.distribuidor;
		corporativoFactory.buscarCliente(obje).then(function(data) {
			vm.Clientes = data.GetBuscaByIdDisListResult;
			
		});
	}
//valida el contrato seleccionado 

	function Seleccionar(contrato) {	
		corporativoFactory.validaContrato(contrato.ContratoBueno, contratos.ContratoMaestro).then(function(data) {			
			if (data.GetValidaSiContratoExiste_CMResult.Bandera) {
				ngNotify.set(data.GetValidaSiContratoExiste_CMResult.Msg, 'error');
			
			} else {
				
				$uibModalInstance.dismiss('cancel');
				$rootScope.$broadcast('agregar_contrato', contrato);
			}
		});
	}
//Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}

	var vm = this;
	vm.cancel = cancel;
	vm.Seleccionar = Seleccionar;
	vm.BusquedaporNombre = BusquedaporNombre;
	vm.BusquedaporContrato = BusquedaporContrato;
}
angular.module('softvApp').controller('BuscaContratoLCtrl', BuscaContratoLCtrl);
