'use strict';
angular.module('softvApp').controller('TipoPagoRecepcionCtrl', TipoPagoRecepcionCtrl);

function TipoPagoRecepcionCtrl($uibModal, $state, $rootScope, cajasFactory, ngNotify, inMenu, $uibModalInstance, elem1, x, proceso) {
//revisa el tipo y depende de esta si llama a una vista especial 
	function aceptar() {
		var metodo = vm.tipo;
		if (vm.tipo == null || vm.tipo === undefined) {
			ngNotify.set('Seleccione un método de pago.', 'error');
		} else if (vm.tipo == 1) {
			var items = {
				Modo: 'v'
			};
			$uibModalInstance.dismiss('cancel');
			vm.animationsEnabled = true;
			$uibModal.open({
				animation: vm.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'views/corporativa/CantidadPagoRecepcion.html',
				controller: 'CantidadPagoRecepcionCtrl',
				controllerAs: '$ctrl',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: {
					items: function () {
						return items;
					},
					metodo: function () {
						return metodo;
					},
					x: function () {
						return x;
					},
					elem1: function () {
						return elem1;
					},
					proceso: function () {
						return proceso;
					}
				}
			});
		} else {
			if (x.Moneda == 'MXN') {
				//alert('MXN');
				$uibModalInstance.dismiss('cancel');
				vm.animationsEnabled = true;
				var modalInstance = $uibModal.open({
					animation: vm.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'views/corporativa/pagarContado.html',
					controller: 'PagarContadoCtrl',
					controllerAs: '$ctrl',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						metodo: function () {
							return metodo;
						},
						x: function () {
							return x;
						},
						elem1: function () {
							return elem1;
						},
						proceso: function () {
							return proceso;
						}
					}
				});
			}
			else {
				//alert('USD');
				//console.log('elem1',elem1);
				var items = {
					Modo: 'vT'
				};
				$uibModalInstance.dismiss('cancel');
				vm.animationsEnabled = true;
				$uibModal.open({
					animation: vm.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'views/corporativa/CantidadPagoRecepcion.html',
					controller: 'CantidadPagoRecepcionCtrl',
					controllerAs: '$ctrl',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						items: function () {
							return items;
						},
						metodo: function () {
							return metodo;
						},
						x: function () {
							return x;
						},
						elem1: function () {
							return elem1;
						},
						proceso: function () {
							return proceso;
						}
					}
				});
			}
		}
	}
//Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}


	var vm = this;
	vm.aceptar = aceptar;
	vm.cancel = cancel;
}
