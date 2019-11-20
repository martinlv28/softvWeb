(function () {
  'use strict';

  angular
    .module('softvApp')
    .controller('modalMotivoCanMaestroCtrl', modalMotivoCanMaestroCtrl);

  modalMotivoCanMaestroCtrl.inject = ['$uibModalInstance', '$uibModal', 'ContratoMaestroFactory', 'ngNotify', '$rootScope', 'ticket', '$localStorage', 'globalService'];

  function modalMotivoCanMaestroCtrl($uibModalInstance, $uibModal, ContratoMaestroFactory, ngNotify, $rootScope, ticket, $localStorage, globalService) {
    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    vm.op = ticket.op;
////funcion de inicializacion del controlador, depende de la op llama a MUESTRAMOTIVOS con parametro 1 o 0 
    this.$onInit = function () {
      console.log('********tipo*********', ticket.tipo);
      console.log('**********ticket ******************', ticket);
      vm.ContratoMaestro = ticket.ContratoMaestro;
      vm.Clv_FacturaMaestro = ticket.ContratoMaestro;
      if (vm.op === 'CAN') {
        ContratoMaestroFactory.MUESTRAMOTIVOS(0).then(function (data) {
          vm.motivos = data.GetMUESTRAMOTIVOSListResult;
        });
      } else {
        ContratoMaestroFactory.MUESTRAMOTIVOS(1).then(function (data) {
          vm.motivos = data.GetMUESTRAMOTIVOSListResult;
        });
      }

    }
//Se puede usar para descartar un modal
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
//depende del tipo de ticket es la factura que se imprimira, hace otras validaciones donde depende de estas si llama a otras vistas o si llama a otras funciones 
    function ok() {



      var opcion;
      if (vm.op == 'CAN') {
        opcion = 5;
      } else {
        opcion = 6;
      }


      if (ticket.tipo === 'M') {
        ContratoMaestroFactory.GuardaMotivos(vm.Clv_FacturaMaestro, vm.motcan.Clv_Motivo).then(function (data) {
          ContratoMaestroFactory.AddBitacoraTickets(vm.Clv_FacturaMaestro, vm.ContratoMaestro, opcion).then(function (data) {
            if (vm.op === 'CAN') {

              ContratoMaestroFactory.GetCANCELA_FACTURASMAESTRA_PRINCIPAL(ticket.Clv_FacturaMaestro).then(function (data) {
                $uibModalInstance.dismiss('cancel');
                ContratoMaestroFactory.GetCancelacion_Factura_CFDMaestro(ticket.Clv_FacturaMaestro, 'M').then(function (result) {
                  $rootScope.$broadcast('reload_tabla');
                  ngNotify.set("Se ha cancelado la factura correctamente");
                });
                if (ticket.Modulo == 'Preliminar') {
                  ContratoMaestroFactory.GetAgregaBitacoraMaestro($localStorage.currentUser.usuario, 'Facturas Preliminares Cancelo', ticket.Clv_FacturaMaestro).then(function (result) {

                  });
                }
                else if (ticket.Modulo == 'Facturas') {
                  ContratoMaestroFactory.GetAgregaBitacoraMaestro($localStorage.currentUser.usuario, 'Facturas Cancelo', ticket.Clv_FacturaMaestro).then(function (result) {

                  });
                }
              });
            } else {

              //ContratoMaestroFactory.TblFacturasOpcionesCM(vm.Clv_FacturaMaestro, 0, 1, 0,0).then(function (data) {
              $uibModalInstance.dismiss('cancel');
              ContratoMaestroFactory.GetImprimeFacturaFiscal(ticket.Clv_FacturaMaestro).then(function (result) {
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

              ngNotify.set("Se ha reimpreso la factura correctamente");
              //  });
            }
          });
        });
      }
      if (ticket.tipo === 'P') {


        ContratoMaestroFactory.GuardaMotivos(vm.Clv_Pago, vm.motcan.Clv_Motivo).then(function (data) {
          ContratoMaestroFactory.AddBitacoraTickets(vm.Clv_Pago, 0, opcion).then(function (data) {
            if (vm.op === 'CAN') {
              ContratoMaestroFactory.GetCANCELA_FACTURASMAESTRA_PRINCIPAL(ticket.Clv_Pago).then(function (data) {
                $uibModalInstance.dismiss('cancel');
                ContratoMaestroFactory.GetCancelacion_Factura_CFDMaestro(ticket.Clv_Pago, 'P').then(function (result) {
                  $rootScope.$broadcast('reload_tabla');
                  ngNotify.set("Se ha cancelado la factura correctamente");
                });
              });
        } else {

            //ContratoMaestroFactory.TblFacturasOpcionesCM(vm.Clv_FacturaMaestro, 0, 1, 0,0).then(function (data) {
            $uibModalInstance.dismiss('cancel');
            ContratoMaestroFactory.GetImprimeFacturaFiscalpago(ticket.Clv_Pago).then(function (result) {

              if (result.GetImprimeFacturaFiscalpagoResult.IdResult === 0) {
                ngNotify.set(result.GetImprimeFacturaFiscalpagoResult.Message, 'error');
                return;
              }

              var url = result.GetImprimeFacturaFiscalpagoResult.urlReporte;
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

            ngNotify.set("Se ha reimpreso la factura correctamente");
            //  });
          }
          });
    });

  }


}
  }
}) ();
