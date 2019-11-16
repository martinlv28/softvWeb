'use strict';
angular.module('softvApp').controller('agregaListaPagoCtrl', agregaListaPagoCtrl)
  .filter('myStrictFilter', function ($filter, $rootScope) {
    return function (input, predicate) {
      return $filter('filter')(input, predicate, true);
    }
  })
  .filter('unique', function () {
    return function (arr, field) {
      var o = {}, i, l = arr.length, r = [];
      for (i = 0; i < l; i += 1) {
        o[arr[i][field]] = arr[i];
      }
      for (i in o) {
        r.push(o[i]);
      }
      return r;
    };
  });

function agregaListaPagoCtrl($uibModal, $state, $rootScope, cajasFactory, pagosMaestrosFactory , ngNotify, $uibModalInstance, Clv_SessionPadre, $filter, Contratos, detallePagoTodo) {
//funcion de inicializacion del controlador, ase haciganciones a elementos de la vista 
  function Init() {
    vm.contratosLigados = Contratos.lstCliS;
    vm.displayCollection = Contratos.lstCliS;
    vm.displayCollection.forEach(function (element) {
      element.selected = false;
    });

  }
//Se puede usar para descartar un modal
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
//lo ordena
  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  //Nos traemos los servicios por contrato que se le puedan aplicar
  function cambiaSeleccion(contratoSeleccionado) {
    vm.ContratoSeleccionado = contratoSeleccionado.ContratoReal;
    if (detallePagoTodo.length > 0) {
      vm.Clv_Session = detallePagoTodo.filter(function (value) { return value.Contrato == contratoSeleccionado.ContratoReal });
      if (vm.Clv_Session.length > 0) {
        vm.Clv_Session = vm.Clv_Session[0].Clv_Session; 
      }
      else{
        pagosMaestrosFactory.GetObtieneClvSessionAgregarLista(contratoSeleccionado.ContratoReal, Clv_SessionPadre).then(function (data) {
          vm.Clv_Session = data.GetObtieneClvSessionAgregarListaResult[0].Clv_Session;
          cajasFactory.muestraServicios(contratoSeleccionado.ContratoReal).then(function (data) {
            data.GetMuestraServiciosFACListResult.unshift({
              'DescripcionFac': '----------------',
              'Clv_Servicio': 0
            });
            vm.servicios = data.GetMuestraServiciosFACListResult;
            vm.selectedService = data.GetMuestraServiciosFACListResult[0];
          });
        });
      }
    }
    if (vm.Clv_Session == undefined) {
      pagosMaestrosFactory.GetObtieneClvSessionAgregarLista(contratoSeleccionado.ContratoReal, Clv_SessionPadre).then(function (data) {
        vm.Clv_Session = data.GetObtieneClvSessionAgregarListaResult[0].Clv_Session;
        cajasFactory.muestraServicios(contratoSeleccionado.ContratoReal).then(function (data) {
          data.GetMuestraServiciosFACListResult.unshift({
            'DescripcionFac': '----------------',
            'Clv_Servicio': 0
          });
          vm.servicios = data.GetMuestraServiciosFACListResult;
          vm.selectedService = data.GetMuestraServiciosFACListResult[0];
        });
      });
    }
    else {
      cajasFactory.muestraServicios(contratoSeleccionado.ContratoReal).then(function (data) {
        data.GetMuestraServiciosFACListResult.unshift({
          'DescripcionFac': '----------------',
          'Clv_Servicio': 0
        });
        vm.servicios = data.GetMuestraServiciosFACListResult;
        vm.selectedService = data.GetMuestraServiciosFACListResult[0];
      });
    }
  }
//obtiene los datos del suscriptor hace validaciones para ver si se puede hacer cambios o añadir adicionales 
  function agregarLista() {
    cajasFactory.dameSuscriptor(vm.ContratoSeleccionado).then(function (suscriptor) {
      vm.Suscriptor = suscriptor.GetDameTiposClientesListResult[0];
      if (vm.selectedService.Clv_Servicio == 0) {
        ngNotify.set('Selecciona un servicio por favor.', 'error');
      } else {
        if (vm.selectedService.Clv_Txt == 'CADIG' || vm.selectedService.Clv_Txt == 'CADI2' || vm.selectedService.Clv_Txt == 'CADI3') {
          cajasFactory.consultaCamdo(vm.Clv_Session, vm.ContratoSeleccionado).then(function (data) {
            if (data.GetCAMDOFACResult.Existe == false) {
              var items = {};
              items.Session = vm.Clv_Session;
              items.Contrato = vm.ContratoSeleccionado;
              items.Texto = vm.selectedService.Clv_Txt;
              items.Tipo = vm.Suscriptor.Clv_TipoCliente;
              vm.animationsEnabled = true;
              var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/facturacion/modalCambioDomicilio.html',
                controller: 'ModalCambioDomicilioCtrl',
                controllerAs: 'ctrl',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                  items: function () {
                    return items;
                  }
                }
              });
              modalInstance.result.then(function () {
                $uibModalInstance.close();
                //alert('Modal ok');
              }, function () {
                $uibModalInstance.close();
                //alert('Modal dismissed');
              });
            } else {
              ngNotify.set('El cliente tiene un cambio de domicilio pendiente.', 'error');
            }
          });
        }
        else if (vm.selectedService.Clv_Txt == 'CANET' || vm.selectedService.Clv_Txt == 'CDUSD') {
          cajasFactory.consultaCamdo(vm.Clv_Session, vm.ContratoSeleccionado).then(function (data) {
            if (data.GetCAMDOFACResult.Existe == false) {
              var items = {};
              items.Session = vm.Clv_Session;
              items.Contrato = vm.ContratoSeleccionado;
              items.Texto = vm.selectedService.Clv_Txt;
              items.Tipo = vm.Suscriptor.Clv_TipoCliente;
              vm.animationsEnabled = true;
              var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/corporativa/ModalCambioDomicilioInternet.html',
                controller: 'ModalCambioDomicilioInternetCtrl',
                controllerAs: 'ctrl',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                  items: function () {
                    return items;
                  }
                }
              });
              modalInstance.result.then(function () {
                $uibModalInstance.close();
                //alert('Modal ok');
              }, function () {
                $uibModalInstance.close();
                //alert('Modal dismissed');
              });
            } else {
              ngNotify.set('El cliente tiene un cambio de domicilio pendiente.', 'error');
            }
          });
        }
        else {
          cajasFactory.addAdicionales(vm.Clv_Session, vm.selectedService.Clv_Txt, vm.ContratoSeleccionado, vm.Suscriptor.Clv_TipoCliente).then(function (data) {
            //$uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
          });
        }
      }
    });
  }

  var vm = this;
  vm.cancel = cancel;
  vm.contratosLigados = [];
  vm.servicios = [];
  vm.cambiaSeleccion = cambiaSeleccion;
  vm.displayCollection = [];
  vm.seleccion = false;
  vm.agregarLista = agregarLista;
  Init();

}
