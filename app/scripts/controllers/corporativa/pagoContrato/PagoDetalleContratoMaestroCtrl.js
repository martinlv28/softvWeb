'use strict'
angular
  .module('softvApp')
  .controller('PagoDetalleContratoMaestroCtrl', PagoDetalleContratoMaestroCtrl);


function PagoDetalleContratoMaestroCtrl($stateParams, ContratoMaestroFactory,corporativoFactory, pagosMaestrosFactory, ngNotify,$uibModal,$filter ) {

  var vm = this;
  vm.IdContratoMaestro = $stateParams.id;
  init();
  vm.agregarListaGeneral=agregarListaGeneral;
  vm.abrirDetalle=abrirDetalle;
  vm.abrirPago=abrirPago;
  vm.PagarCredito=PagarCredito;
//funcion de inicializacion del controlador, obtiene informacion del contrato, valida si hay conceptos por facturar 
  function init() {

  /*   var fechaHoy = new Date();
    fechaHoy = $filter('date')(fechaHoy, 'dd/MM/yyyy');
    var fechaVigenciaAux = vm.Contratos.FechaVencimiento.replace(/[^0-9\.]+/g, '');
    var pattern = /(\d{2})(\d{2})(\d{4})/;
    fechaVigenciaAux = new Date(fechaVigenciaAux.replace(pattern, '$2/$1/$3'));
    if(fechaVigenciaAux < fechaHoy){
        ngNotify.set('El contrato maestro se encuentra vencido, no se pueden aplicar pagos', 'error');
        return;
    }   */

    corporativoFactory.singleContrato($stateParams.id).then(function (data) {        
        vm.Contratos = data.GetRelContratosResult[0];
        pagosMaestrosFactory.cobraSaldoMaestro(vm.IdContratoMaestro).then(function (data) {
            vm.saldo = data.GetCobraContratoMaestroResult;
            HacerPregunta(vm.saldo.Clv_SessionPadre, 900);
            pagosMaestrosFactory.dameDetalle(vm.saldo.Clv_SessionPadre).then(function (detallePago) {
      
              if (detallePago.GetDetalleContratosMaestrosListResult.lista.length == 0) {
                vm.blockedocta = true;
                vm.blockPagar = true;
                vm.color = '#f3f3f3';
                ngNotify.set('No hay conceptos para facturar', 'warn');
              } else {
                vm.blockedocta = false;
                vm.blockPagar = false;
                vm.color = 'white';
              }
              vm.detallePago = detallePago.GetDetalleContratosMaestrosListResult.lista;
              vm.sumaPagos = detallePago.GetDetalleContratosMaestrosListResult.datosdetalle;
              vm.detallePagoTodo = detallePago.GetDetalleContratosMaestrosListResult.lista;
              vm.detallePagoAux = vm.detallePago;
              DetalleFactura(vm.saldo.Clv_SessionPadre);
            });
          });
    });

  
  }
//obtiene detalles de la factura 
  function DetalleFactura(clv_session) {
    ContratoMaestroFactory.Sp_DameDetalleFacturaMaestra(clv_session).then(function (result) {
      vm.detalleFactura = result.GetSp_DameDetalleFacturaMaestraListResult;
    });
  }
//valida que haya una pregunta, si la hay llama a la vista ModalHazPregunta.html
  function HacerPregunta(clv_session, option) { 
   
    ContratoMaestroFactory.uspHaz_Pregunta(vm.IdContratoMaestro, 900).then(function (data) {
      console.log('response haz pregunta',data);
      vm.pregunta = data.GetDeepuspHaz_Pregunta_CMResult.Pregunta;
      vm.MesesAdelantados = data.GetDeepuspHaz_Pregunta_CMResult.MesesAdelantados;

      if (vm.pregunta != null) {
        var object = {};
        object.clv_session = clv_session;
        object.contrato = vm.IdContratoMaestro;
        object.pregunta = vm.pregunta;
        object.MesesAdelantados = vm.MesesAdelantados;
        object.option = option;
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/corporativa/PagoContrato/ModalHazPregunta.html',
          controller: 'ModalHazPreguntaCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
          keyboard: false,
          size: 'md',
          resolve: {
            object: function () {
              return object;
            }
          }
        });

      }

    });
  }
//llama a la vista abrirDetalle.html
  function abrirDetalle(x) {
    vm.animationsEnabled = true;
    var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/abrirDetalle.html',
        controller: 'AbrirDetalleCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
            x: function () {
                return x;
            }
        }
    });
}

//llama a la vista agregaListaPago.html
  function agregarListaGeneral(){ 
    vm.animationsEnabled = true;
    vm.modalInstanceLista = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/agregaListaPago.html',
        controller: 'agregaListaPagoCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
            Contratos : function () {
                return vm.Contratos;
            },
            Clv_SessionPadre : function () {
                return vm.saldo.Clv_SessionPadre;
            },
            detallePagoTodo : function () {
                return vm.detallePagoTodo;
            }
        }
    });   
    vm.modalInstanceLista.result.then(function () {
        pagosMaestrosFactory.dameDetalle(vm.saldo.Clv_SessionPadre).then(function (detallePago) {
          console.log(detallePago);
            vm.detallePago = detallePago.GetDetalleContratosMaestrosListResult.lista.filter(function(value) { return value.Importe >= 0 });
            vm.detallePagoTodo = detallePago.GetDetalleContratosMaestrosListResult.lista;
            vm.sumaPagos = detallePago.GetDetalleContratosMaestrosListResult.datosdetalle;
            vm.detallePagoAux = vm.detallePago;
        });
        DetalleFactura(vm.saldo.Clv_SessionPadre);
    }, function () {
        //alert('Modal dismissed');
    });
}
//llama a la vista yaPago.html
function abrirPago(x, y) {
  vm.animationsEnabled = true;
  var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/corporativa/yaPago.html',
      controller: 'YaPagoCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'md',
      resolve: {
          x: function () {
              return x;
          },
          y: function () {
              return y;
          }
      }
  });
}

//hace asignaciones de valores y llama al avista abrirPago.html
function PagarCredito(z, imp, y, tipo) {
  imp.forEach(function (element) {
      if (element.Posicion == 4) {
          vm.tot = element.Total;
      }
  });
  var x = {
      ContratoMaestro: y.IdContratoMaestro,
      IdCompania: z.IdCompania,
      IdDistribuidor: z.IdDistribuidor,
      Clv_Session: z.Clv_Session,
      Clv_SessionPadre: z.Clv_SessionPadre,
      tipo: tipo
  }
  vm.animationsEnabled = true;
  var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/corporativa/abrirPago.html',
      controller: 'AbrirPagoCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      resolve: {
          elem1: function () {
              return vm.tot;
          },
          x: function () {
              return x;
          }
      }
  });
}



}
