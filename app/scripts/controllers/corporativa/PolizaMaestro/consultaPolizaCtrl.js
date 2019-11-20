'use strict';
angular.module('softvApp').controller('consultaPolizaCtrl', consultaPolizaCtrl);

function consultaPolizaCtrl($uibModal, ContratoMaestroFactory, ngNotify, corporativoFactory, $filter, globalService, $stateParams, $state) {
  var vm = this;
  vm.sortKey = 'Referencia';
  vm.EliminaPoliza = EliminaPoliza;
  vm.Exportar = Exportar;
//funcion de inicializacion del controlador, obtiene informacion pilizas maestro 
  this.$onInit = function () {
    var params = {};
    params.filtros = {
      'Op': 0,
      'Clv_Plaza': 0,
      'FechaPoliza': '19000101',
      'Clv_Poliza': $stateParams.id,
      'ContratoMaestro': 0
    };
    corporativoFactory.GetDetallesPolizaMaestro(params).then(function (data) {
      vm.DetallePoliza = data.GetDetallesPolizaMaestroResult;
      corporativoFactory.GetObtieneGeneralesPolizaMaestro($stateParams.id).then(function (data2) {
        vm.Poliza = data2.GetObtieneGeneralesPolizaMaestroResult;
      });
    });
  }
//Elimina la póliza seleccionada
  function EliminaPoliza() {
    //Eliminamos la póliza seleccionada
    var params = {};
    params.filtros = {
      'Op': 0,
      'Clv_Plaza': 0,
      'FechaPoliza': '19000101',
      'Clv_Poliza': $stateParams.id,
      'ContratoMaestro': 0,
      'Dolares': false
    };
    corporativoFactory.EliminaPoliza(params).then(function (data) {
      $state.go('home.corporativa.polizasFacturas');
      ngNotify.set('Póliza eliminada exitosamente.', 'success');
    });
  }
//llama a GetPolizaTxt, revisa el navegador del cual esta navegando 
  function Exportar() {
    var params = {};
    params.filtros = {
      'Op': 0,
      'Clv_Plaza': 0,
      'FechaPoliza': '19000101',
      'Clv_Poliza': $stateParams.id,
      'ContratoMaestro': 0,
      'Dolares': false
    };
    vm.url = '';
    corporativoFactory.GetPolizaTxt(params).then(function (data) {
      vm.url = globalService.getUrlReportes() + '/' + data.GetPolizaTxtResult;
      //$window.open(vm.url, '_self');

      var isChrome = !!window.chrome && !!window.chrome.webstore;
      var isIE = /*@cc_on!@*/ false || !!document.documentMode;
      var isEdge = !isIE && !!window.StyleMedia;


      if (isChrome) {
        var url = window.URL || window.webkitURL;

        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', vm.url);
        downloadLink.attr('target', '_self');
        downloadLink.attr('download', 'invoice.txt');
        downloadLink[0].click();
      } else if (isEdge || isIE) {
        window.navigator.msSaveOrOpenBlob(vm.url, 'invoice.txt');

      } else {
        var fileURL = vm.url;
        window.open(fileURL);
      }
    });
  }

}
