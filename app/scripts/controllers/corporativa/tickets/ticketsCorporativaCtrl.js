(function () {
  'use strict';

  angular
    .module('softvApp')
    .controller('ticketsCorporativaCtrl', ticketsCtrl);

  ticketsCtrl.inject = [''];

  function ticketsCtrl(ContratoMaestroFactory, $filter, $uibModal, ngNotify, $rootScope, pagosMaestrosFactory, ticketsFactory, globalService, $window, $timeout) {

    /* 
        function GetEnviaFacturaFiscal(item) {
    
    
          ContratoMaestroFactory.GetEnviaFacturaFiscal(item.Clv_FacturaMaestro).then(function (result) {
            if (result.GetEnviaFacturaFiscalResult.IdResult === 0) {
              ngNotify.set(result.GetEnviaFacturaFiscalResult.Message, 'error');
              return;
            } else {
              ngNotify.set('Factura se envió correctamente', 'success');
            }
    
          });
        }
     */
//valida la opc donde depende de este si llama a otras vistas o si llama a GetEnviaFacturaFiscal
    function opcionTicket(opc, ticket) {
      ticket.tipo = 'M';
      ticket.Modulo = 'Facturas';
      console.log(ticket.tipo);
      if (opc == 1) {
        ticket.op = 'PRINT';

        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/corporativa/modalMotivoCanMaestro.html',
          controller: 'modalMotivoCanMaestroCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
          keyboard: false,
          class: 'modal-backdrop fade',
          size: 'md',
          resolve: {
            ticket: function () {
              return ticket;
            }
          }
        });

      } else if (opc == 3) {

        ContratoMaestroFactory.GetEnviaFacturaFiscal(ticket.Clv_FacturaMaestro).then(function (result) {
          if (result.GetEnviaFacturaFiscalResult.IdResult === 0) {
            ngNotify.set(result.GetEnviaFacturaFiscalResult.Message, 'error');
            return;
          } else {
            ngNotify.set('Factura se envió correctamente', 'success');
          }

        });


      } else {

        ticket.op = 'CAN';
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/facturacion/modalCancelarTicket.html',
          controller: 'modalCancelaTicketCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
          keyboard: false,
          class: 'modal-backdrop fade',
          size: 'md',
          resolve: {
            ticket: function () {
              return ticket;
            }
          }
        });


      }


    }



//llama a la vista modalPagosFacturas.html
    function historial(x) {

      vm.animationsEnabled = true;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/modalPagosFacturas.html',
        controller: 'modalPagosFacturasCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          factura: function () {
            return x;
          }
        }
      });


    }


    /*   function GetImprimeFacturaFiscal(item) {
  
        ContratoMaestroFactory.GetImprimeFacturaFiscal(item.Clv_FacturaMaestro).then(function (result) {
          if (result.GetImprimeFacturaFiscalResult.IdResult === 0) {
            ngNotify.set(result.GetImprimeFacturaFiscalResult.Message, 'error');
            return;
          }
  
          var url = result.GetImprimeFacturaFiscalResult.urlReporte;
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
        });
      }
   */
    /* 
        function  GetCancelacion_Factura_CFDMaestro(item){
    
          ContratoMaestroFactory.GetCancelacion_Factura_CFDMaestro(item.Clv_FacturaMaestro,'M').then(function(result){
           console.log(result);
          });
        } */

//depende del parametro resivido asigna valores al contenido de parametros y al final llama a BuscaFacturasMaestro
    function Buscar(opc) {

      var parametros = {};

      if (opc == 1) {
        parametros = {
          'Fecha': $filter('date')(vm.fecha, 'dd/MM/yyyy'),
          'Ticket': '',
          'ContratoMaestro': 0,
          'Cliente': '',
          'Op': 1,
          'Saldada': 0
        };

      } else if (opc == 2) {
        parametros = {
          'Fecha': '',
          'Ticket': vm.folio,
          'ContratoMaestro': 0,
          'Cliente': '',
          'Op': 2,
          'Saldada': 0
        };


      } else if (opc == 3) {

        parametros = {
          'Fecha': '',
          'Ticket': '',
          'ContratoMaestro': vm.contrato,
          'Cliente': '',
          'Op': 3,
          'Saldada': 0
        };

      } else if (opc == 4) {

        parametros = {
          'Fecha': '',
          'Ticket': '',
          'ContratoMaestro': 0,
          'Cliente': vm.cliente,
          'Op': 4,
          'Saldada': 0
        };

      } else {

        parametros = {
          'Fecha': '',
          'Ticket': '',
          'ContratoMaestro': 0,
          'Cliente': '',
          'Op': 0,
          'Saldada': 0
        };
      }

      ContratoMaestroFactory.BuscaFacturasMaestro(parametros).then(function (data) {
        vm.Tickets = data.GetBuscaFacturasMaestroListResult;
      });
    }
//descarga el xml del ticket resivido 
    function DescargarXML(ticket) {
      var params = {
        'Tipo': 'M',
        'Clave': ticket.Clv_FacturaMaestro
      };
      vm.url = '';
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
        downloadLink.attr('download', 'Factura ' + ticket.Factura + '.xml');
        downloadLink[0].click();
      });
    }
//descarga el pdf del ticket resivido 
    function DescargarPDF(ticket) {
      ContratoMaestroFactory.GetImprimeFacturaFiscal(ticket.Clv_FacturaMaestro).then(function (result) {
        if (result.GetImprimeFacturaFiscalResult.IdResult === 0) {
          ngNotify.set(result.GetImprimeFacturaFiscalResult.Message, 'error');
          return;
        }

        vm.url = globalService.getReporteUrlMizar() + '/Reportes/' + result.GetImprimeFacturaFiscalResult.urlReporte;
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;

        console.log('isChrome', isChrome);
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', vm.url);
        downloadLink.attr('target', '_self');
        downloadLink.attr('download', 'Factura ' + ticket.Factura + '.pdf');
        downloadLink[0].click();

        //$window.open(globalService.getReporteUrlMizar() + '/Reportes/' + result.GetImprimeFacturaFiscalResult.urlReporte, '_self');

      });
    }
//llama a BuscaFacturasMaestro con fechas definidas o si no tiene manda fechas en blanco 
    function Exportar() {
      var parametros = {};
      if (vm.FechaInicial == undefined || vm.FechaFinal == undefined) {
        parametros = {
          'Fecha': '',
          'Ticket': '',
          'ContratoMaestro': 0,
          'Cliente': '',
          'Op': 0,
          'Saldada': 0
        };

      } else {

        parametros = {
          'Fecha': $filter('date')(vm.FechaInicial, 'dd/MM/yyyy'),
          'FechaFinal': $filter('date')(vm.FechaFinal, 'dd/MM/yyyy'),
          'Ticket': '',
          'ContratoMaestro': 0,
          'Cliente': '',
          'Op': 6,
          'Saldada': 0
        };
      }

      ContratoMaestroFactory.BuscaFacturasMaestro(parametros).then(function (data) {
        vm.TicketsDescarga = data.GetBuscaFacturasMaestroListResult;
        //console.log('vm.TicketsDescarga',vm.TicketsDescarga);
        $timeout(function () {
          angular.element('#descarga').triggerHandler('click');
        });
      });
    }

    var vm = this;
    vm.Buscar = Buscar;
    Buscar(0);
    vm.historial = historial;
    vm.opcionTicket = opcionTicket;
    // vm.GetEnviaFacturaFiscal = GetEnviaFacturaFiscal;
    //vm.GetImprimeFacturaFiscal = GetImprimeFacturaFiscal;
    //vm.GetCancelacion_Factura_CFDMaestro=GetCancelacion_Factura_CFDMaestro;
    vm.DescargarPDF = DescargarPDF;
    vm.DescargarXML = DescargarXML;
    vm.Exportar = Exportar;
    vm.csvheader = ['ContratoMaestro', 'Factura', 'Ticket', 'Status', 'Fecha', 'Importe', 'Moneda', 'NombreComercial'];
    vm.csvorder = ['ContratoMaestro', 'Factura', 'Ticket', 'Status', 'Fecha', 'Importe', 'Moneda', 'Cliente'];
  }
})();
