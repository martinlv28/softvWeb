'use strict';
angular.module('softvApp').controller('EscogerPagoCtrl', EscogerPagoCtrl);

function EscogerPagoCtrl($uibModal, $state, $rootScope, cajasFactory, ngNotify, inMenu, $uibModalInstance, $localStorage, metodo, pagosMaestrosFactory, x, elem1, proceso) {
//en base a el contenido de la variable pago, asigna valores a elementos de la ventana 
  function cambio(pago) {
    if (pago == 1) {
      vm.fijos = true;
      vm.variables = false;
      vm.botonFijo = true;
      vm.botonVariable = false;
    } else if (pago == 2) {
      vm.fijos = false;
      vm.variables = true;
      vm.botonFijo = false;
      vm.botonVariable = true;
    }
  }
//iguala el monto a lo que se abonara 
  function abonoMenor() {
    if (vm.abono > vm.monto) {
      vm.abono = vm.monto;
    }
  }
//verifica el proceso, donde depende de este, valida los campos en hambos casos y em uno llama a varias funciones y en otro manda a otra vista
  function guardarFijo() {

    console.log(proceso);
    if (vm.proceso === 'PCM') {
      if (vm.numeroPagos == undefined || vm.numeroPagos == null || vm.numeroPagos == 0 || vm.numeroPagos < 0) {
        ngNotify.set('Los campos no deben de ir nulos, negativos o en 0', 'error');
        return;
      }     
      var obj = {
        'ContratoMaestro': x.ContratoMaestro,
        'Credito': metodo,
        'Cajera': $localStorage.currentUser.usuario,
        'IpMaquina': $localStorage.currentUser.maquina,
        'Sucursal': $localStorage.currentUser.sucursal,
        'IdCompania': x.IdCompania,
        'IdDistribuidor': x.IdDistribuidor,
        'ClvSessionPadre': x.Clv_SessionPadre,
        'Tipo': 0,
        'ToKen2': $localStorage.currentUser.token,
        'NoPagos': vm.numeroPagos,
        'PagoInicial': 0
      };

      pagosMaestrosFactory.generaFactura(obj).then(function (data) {
        var clvFactura = data.GetGrabaFacturaCMaestroResult.ClvFacturaMaestro;
        var elem = {
          ClvFacturaMaestro: clvFactura,
          Credito: metodo,
          NoPago: vm.numeroPagos,
          PagoInicial: 0,

        };
        pagosMaestrosFactory.actFactura(elem).then(function (dataAct) {
          ngNotify.set('Factura Generada Correctamente', 'success');
          $uibModalInstance.dismiss('cancel');
        });
      });

    } else {

      if (vm.pagoInicial == undefined || vm.pagoInicial == null || vm.pagoInicial == 0 || vm.pagoInicial < 0 || vm.numeroPagos == undefined || vm.numeroPagos == null || vm.numeroPagos == 0 || vm.numeroPagos < 0) {
        ngNotify.set('Los campos no deben de ir nulos, negativos o en 0', 'error');
        return;
      }


      var elem = {
        ClvFacturaMaestro: x.Clv_FacturaMaestro,
        Credito: metodo,
        NoPago: vm.numeroPagos,
        PagoInicial: vm.pagoInicial
      };
      $uibModalInstance.dismiss('cancel');
      vm.animationsEnabled = true;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/pagarCredito.html',
        controller: 'PagarCreditoCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        resolve: {
          elem: function () {
            return elem;
          },
          x: function () {
            return x;
          },
          proceso:function(){
            return vm.proceso;
          }
        }
      });

    }



    // });

  }
//depende de la variable proceso si llama a algunas funciones en espesifico o a una vista
  function guardarVariable() {

    if (vm.proceso === 'PCM') {

      var obj = {
        'ContratoMaestro': x.ContratoMaestro,
        'Credito': metodo,
        'Cajera': $localStorage.currentUser.usuario,
        'IpMaquina': $localStorage.currentUser.maquina,
        'Sucursal': $localStorage.currentUser.sucursal,
        'IdCompania': x.IdCompania,
        'IdDistribuidor': x.IdDistribuidor,
        'ClvSessionPadre': x.Clv_SessionPadre,
        'Tipo': 0,
        'ToKen2': $localStorage.currentUser.token,
        'NoPagos': 0,
        'PagoInicial': 0
      };
      
      pagosMaestrosFactory.generaFactura(obj).then(function (data) {
        var clvFactura = data.GetGrabaFacturaCMaestroResult.ClvFacturaMaestro;
        var elem = {
          ClvFacturaMaestro: clvFactura,
          Credito: metodo,
          NoPago:0 ,
          PagoInicial: 0,

        };
        pagosMaestrosFactory.actFactura(elem).then(function (dataAct) {
          ngNotify.set('Factura Generada Correctamente', 'success');
          $uibModalInstance.dismiss('cancel');
        });
      });




    }else{

      if (vm.abono == undefined || vm.abono == null || vm.abono == 0 || vm.abono < 0) {
        ngNotify.set('Los campos no deben de ir nulos, negativos o en 0', 'error');
      } else {
        var elem = {
          ClvFacturaMaestro: x.Clv_FacturaMaestro,
          Credito: metodo,
          NoPago: 0,
          PagoInicial: vm.abono
        };
  
        $uibModalInstance.dismiss('cancel');
        vm.animationsEnabled = true;
        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/corporativa/pagarCredito.html',
          controller: 'PagarCreditoCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
          keyboard: false,
          size: 'md',
          resolve: {
            elem: function () {
              return elem;
            },
            x: function () {
              return x;
            },
            proceso:function(){
              return vm.proceso;
            }
          }
        });
        // });
      }

    }





  
  }
//depende de el proceso si hace asignaciones espesificas en elementos de la vista 
  function operacion() {

    if (vm.proceso === 'PCM') {
      if (vm.numeroPagos === 0 || vm.numeroPagos === undefined || vm.numeroPagos === null) {
        vm.mensualidad = 0;
      } else {
        vm.mensualidad = vm.monto / vm.numeroPagos;
      }
    } else {
      if (vm.pagoInicial > vm.monto) {
        vm.pagoInicial = 0;
      } else {
        vm.primer = (vm.monto - vm.pagoInicial);
        if (vm.numeroPagos == 0 || vm.numeroPagos == undefined || vm.numeroPagos == null) {
          vm.mensualidad = 0;
        } else {
          vm.mensualidad = vm.primer / vm.numeroPagos;
        }
      }
    }


  }
//Se puede usar para descartar un modal
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }

  var vm = this;
  vm.monto = elem1;
  vm.operacion = operacion;
  operacion();
  vm.proceso = proceso;
  console.log(vm.proceso);
  vm.numeroPagos = 1;
  vm.cambio = cambio;
  vm.abonoMenor = abonoMenor;
  vm.guardarFijo = guardarFijo;
  vm.guardarVariable = guardarVariable;
  vm.cancel = cancel;

}
