(function () {
  'use strict';

  angular
    .module('softvApp')
    .controller('notaCreditoCtrl', notaCreditoCtrl);

  notaCreditoCtrl.inject = ['$uibModal', '$state', '$rootScope', 'ngNotify', 'ContratoMaestroFactory', '$filter', 'globalService', 'ticketsFactory','$timeout'];
  function notaCreditoCtrl($uibModal, $state, $rootScope, ngNotify, ContratoMaestroFactory, $filter, globalService, ticketsFactory, $timeout) {
    var vm = this;
    vm.buscar = buscar;
    vm.DetalleNota = DetalleNota;
    vm.opcionesNota = opcionesNota;
    vm.DescargarPDF = DescargarPDF;
    vm.DescargarXML = DescargarXML;
    vm.Exportar = Exportar;
//funcion de inicializacion del controlador, revisa el id, depende de este hace asignaciones, despues llama a FiltrosBusquedaNotasDeCredito
    this.$onInit = function () {
      buscar(0);
      vm.csvheader = ['NotaCredito', 'Factura', 'ContratoMaestro', 'FechaGeneracion', 'Status', 'Ticket', 'Monto','Moneda'];
      vm.csvorder = ['NotaCredito', 'FacturaMizar', 'ContratoMaestro', 'FechaGeneracion', 'Status', 'Ticket', 'Monto','Moneda'];
    }

    function buscar(id) {

      if (id == 1) {
        var parametros = {
          'Op': 1,
          'Clv_NotadeCredito': vm.folio,
          'Fecha': '',
          'FechaFin': '',
          'ContratoMaestro': 0
        }

      } else if (id == 2) {

        var parametros = {
          'Op': 3,
          'Clv_NotadeCredito': 0,
          'Fecha': '',
          'FechaFin': '',
          'ContratoMaestro': vm.contrato
        }
      } else if (id == 3) {
        var parametros = {
          'Op': 2,
          'Clv_NotadeCredito': 0,
          'Fecha': $filter('date')(vm.fecha, 'dd/MM/yyyy'),
          'FechaFin': '',
          'ContratoMaestro': 0
        }


      } else {
        var parametros = {
          'Op': 0,
          'Clv_NotadeCredito': 0,
          'Fecha': '',
          'FechaFin': '',
          'ContratoMaestro': 0
        }
      }

      ContratoMaestroFactory.FiltrosBusquedaNotasDeCredito(parametros).then(function (data) {
        vm.Notas = data.GetBusquedaNotasListResult;
      });
    }
//llama a la vista ModalDetalleNota.html
    function DetalleNota(nota) {

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/ModalDetalleNota.html',
        controller: 'ModalDetalleNotaCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "lg",
        resolve: {
          nota: function () {
            return nota;
          }
        }
      });
    }

//obtiene la factura para despues descargarlo en xml
    function DescargarXML(nota) {
      var params = {
        'Tipo': 'T',
        'Clave': nota.NotaCredito
      };
      vm.url = '';
      console.log(nota);
      ticketsFactory.GetFacturaXML(params).then(function (data) {
        console.log(data);
        vm.url = globalService.getUrlReportes() + '/Reportes/' + data.GetFacturaXMLResult.Archivo;
        //$window.open(vm.url, '_self');

        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;

        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', vm.url);
        downloadLink.attr('target', '_self');
        downloadLink.attr('download', 'NC ' + nota.FacturaMizar + '.xml');
        downloadLink[0].click();

      });
    }
//obtiene la factura para despues descargarlo en pdf
    function DescargarPDF(nota) {
      ContratoMaestroFactory.GetImprimeFacturaFiscalNotaMaestro(nota.NotaCredito).then(function (result) {
        if (result.GetImprimeFacturaFiscalNotaMaestroResult.IdResult === 0) {
          ngNotify.set(result.GetImprimeFacturaFiscalNotaMaestroResult.Message, 'error');
          return;
        }

        vm.url = globalService.getReporteUrlMizar() + '/Reportes/' + result.GetImprimeFacturaFiscalNotaMaestroResult.urlReporte;
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;

        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', vm.url);
        downloadLink.attr('target', '_self');
        downloadLink.attr('download', 'NC ' + nota.FacturaMizar + '.pdf');
        downloadLink[0].click();

        //$window.open(vm.url, '_self');

      });
    }

//revisa la opcion de nota y depende de esta si llama a funciones espesificas o a la vista ModalDetalleFactura.html

    function opcionesNota(opcion, nota) {
      if (opcion == 1) {
        ContratoMaestroFactory.TblNotasMaestraOpciones(nota, 0, 1, 0).then(function (data) {
          ngNotify.set('La nota se ha refacturado correctamente.', 'success');
        });

      } else if (opcion === 2) {


        ContratoMaestroFactory.GetImprimeFacturaFiscalNotaMaestro(nota).then(function (data) {
          console.log(data);
          if (data.GetImprimeFacturaFiscalNotaMaestroResult.IdResult === 0) {
            ngNotify.set(data.GetImprimeFacturaFiscalNotaMaestroResult.Message, 'error');
            return;
          }
          var url = data.GetImprimeFacturaFiscalNotaMaestroResult.urlReporte;
          vm.animationsEnabled = true;
          var modalInstance = $uibModal.open({
            animation: vm.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/corporativa/ModalDetalleFactura.html',
            controller: 'ModalDetalleFacturaCtrl',
            controllerAs: '$ctrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
              url: function () {
                return url;
              }
            }
          });


          ngNotify.set("Se ha reimpreso la factura correctamente");

        });

      }
    }
//revisa las fechas y despues llama a la funcion FiltrosBusquedaNotasDeCredito
    function Exportar() {
      var parametros = {};
      if (vm.FechaInicial == undefined || vm.FechaFinal == undefined) {
        parametros.Op = 0;
        parametros.Clv_NotadeCredito = 0;
        parametros.Fecha = '';
        parametros.FechaFin = '';
        parametros.ContratoMaestro = 0;
      }
      else{
        parametros.Op = 4;
        parametros.Clv_NotadeCredito = 0;
        parametros.Fecha = $filter('date')(vm.FechaInicial, 'dd/MM/yyyy');
        parametros.FechaFin = $filter('date')(vm.FechaFinal, 'dd/MM/yyyy');
        parametros.ContratoMaestro = 0;
      }
      ContratoMaestroFactory.FiltrosBusquedaNotasDeCredito(parametros).then(function (data) {
        vm.NotasDescarga = data.GetBusquedaNotasListResult;
        $timeout(function () {
          angular.element('#descarga').triggerHandler('click');
        });
      });
    }

  }
})();