"use strict";
angular.module("softvApp").controller("PagarContadoCtrl", PagarContadoCtrl);

function PagarContadoCtrl(
  $uibModal,
  ContratoMaestroFactory,
  $state,
  $rootScope,
  ngNotify,
  inMenu,
  $uibModalInstance,
  metodo,
  x,
  elem1,
  $localStorage,
  pagosMaestrosFactory,
  cajasFactory,
  proceso,
  $filter
) {
  ////funcion de inicializacion del controlador, obtiene la informacion de los medios y de los bancos 
  function initialData() {
    vm.monto = elem1;
    pagosMaestrosFactory.getMedios().then(function (data) {
      data.GetObtieneMediosPagoListResult.unshift({
        Nombre: "----------------",
        IdMedioPago: 0
      });
      vm.medios = data.GetObtieneMediosPagoListResult;
      vm.selectedMedio = data.GetObtieneMediosPagoListResult[0];
    });
    cajasFactory.dameBancos().then(function (data) {
      data.GetMuestraBancosListResult.unshift({
        nombre: "----------------",
        Clave: 0
      });
      vm.bancos = data.GetMuestraBancosListResult;
      vm.selectedBancoTransferencia = data.GetMuestraBancosListResult[0];
      vm.selectedBancoCheque = data.GetMuestraBancosListResult[0];
    });
  }
//hace los cambios necesarios y asigna nuevos valores a elementos de la vista
  function cambioEfectivo() {
    vm.maxmonto = vm.monto * 10;
    if (vm.efectivo > vm.maxmonto) {
      vm.efectivo = vm.maxmonto;
    }
    vm.cambio = vm.efectivo - vm.monto;
    if (vm.cambio < 0) {
      vm.cambio = 0;
    }
    vm.TotalAbonado = vm.efectivo;
    if (vm.TotalAbonado > vm.monto) {
      vm.TotalAbonado = vm.monto;
    }
    vm.casePago = 1;
    vm.dineroCheque = "";
    vm.numeroCheque = "";
    vm.cuentaTransferencia = "";
    vm.autorizacionTransferencia = "";
    vm.dineroCredito = "";
    vm.dineroTransferencia = "";
    vm.pagoNota = "";
  }
//hace los cambios necesarios y asigna nuevos valores a elementos de la vista
  function cambioCheque() {
    vm.cambio = "";
    vm.TotalAbonado = "";
    if (vm.dineroCheque > vm.monto) {
      vm.dineroCheque = vm.monto;
    }
    vm.TotalAbonado = vm.dineroCheque;
    if (vm.TotalAbonado > vm.monto) {
      vm.TotalAbonado = vm.monto;
    }
    vm.efectivo = "";
    vm.casePago = 2;
    vm.cuentaTransferencia = "";
    vm.autorizacionTransferencia = "";
    vm.dineroCredito = "";
    vm.pagoNota = "";
    vm.dineroTransferencia = "";
  }
//hace los cambios necesarios y asigna nuevos valores a elementos de la vista
  function cambioNota() {
    vm.cambio = '';
    vm.TotalAbonado = '';
    if (vm.dineroNota > vm.monto) {
      vm.dineroNota = vm.monto;
    }
    vm.TotalAbonado = vm.dineroNota;
    if (vm.TotalAbonado > vm.monto) {
      vm.TotalAbonado = vm.monto;
    }
    vm.efectivo = '';
    vm.casePago = 4;
    vm.cuentaTransferencia = '';
    vm.autorizacionTransferencia = '';
    vm.dineroCredito = '';
    vm.pagoNota = '';
    vm.dineroTransferencia = '';
  }
//hace los cambios necesarios y asigna nuevos valores a elementos de la vista 
  function cambioTransferencia() {
    vm.cambio = "";
    vm.TotalAbonado = "";
    if (vm.dineroTransferencia > vm.monto) {
      vm.dineroTransferencia = vm.monto;
    }
    vm.TotalAbonado = vm.dineroTransferencia;
    if (vm.TotalAbonado > vm.monto) {
      vm.TotalAbonado = vm.monto;
    }
    vm.dineroCheque = "";
    vm.numeroCheque = "";
    vm.efectivo = "";
    vm.casePago = 3;
    vm.dineroCredito = "";
    vm.pagoNota = "";
  }
//hace los cambios necesarios y asigna nuevos valores a elementos de la vista 
  function muestraFactura(url) {
    vm.animationsEnabled = true;
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: "modal-title",
      ariaDescribedBy: "modal-body",
      templateUrl: "views/corporativa/ModalDetalleFactura.html",
      controller: "ModalDetalleFacturaCtrl",
      controllerAs: "$ctrl",
      backdrop: "static",
      keyboard: false,
      size: "lg",
      resolve: {
        url: function () {
          return url;
        }
      }
    });
  }
//hace las correspondientes validaciones para despues poder generar las facturas 
  function ok() {

    if(vm.FechaPago == undefined){
      vm.FechaPago = new Date();
    }
    if(vm.HoraPago == undefined){
      vm.HoraPago = '00:00'
    }

    if(vm.numeroCheque == undefined){
      vm.numeroCheque = '';
    }
    var obj = {
      ContratoMaestro: x.ContratoMaestro,
      Credito: metodo,
      Cajera: $localStorage.currentUser.usuario,
      IpMaquina: $localStorage.currentUser.maquina,
      Sucursal: $localStorage.currentUser.sucursal,
      IdCompania: x.IdCompania,
      IdDistribuidor: x.IdDistribuidor,
      ClvSessionPadre: x.Clv_SessionPadre,
      Tipo: 0,
      ToKen2: $localStorage.currentUser.token,
      NoPagos: 0,
      PagoInicial: 0
    };
    if (vm.casePago == undefined || vm.selectedMedio.IdMedioPago == 0) {
      ngNotify.set(
        "Por favor seleccione el medio de pago y llene un metodo de pago.",
        "error"
      );
    } else {
      var objact = {
        ClvFacturaMaestro: x.Clv_FacturaMaestro,
        Credito: metodo,
        NoPago: 0,
        PagoInicial: 0
      };
      switch (vm.casePago) {
        case 1:
          if (x.tipo == "pagos") {
            pagosMaestrosFactory.generaFactura(obj).then(function (data) {
              vm.r1 = data.GetGrabaFacturaCMaestroResult.ClvFacturaMaestro;
              x.Clv_FacturaMaestro = vm.r1;
              objact.ClvFacturaMaestro = x.Clv_FacturaMaestro;
              if (vm.efectivo >= vm.monto) {
                var objPagar = {
                  Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                  ContratoMaestro: x.ContratoMaestro,
                  Cajera: $localStorage.currentUser.usuario,
                  IpMaquina: $localStorage.currentUser.maquina,
                  Sucursal: $localStorage.currentUser.sucursal,
                  Monto: vm.monto,
                  GLOEFECTIVO2: vm.efectivo,
                  GLOCHEQUE2: 0,
                  GLOCLV_BANCOCHEQUE2: 0,
                  NUMEROCHEQUE2: "",
                  GLOTARJETA2: 0,
                  GLOCLV_BANCOTARJETA2: 0,
                  NUMEROTARJETA2: "",
                  TARJETAAUTORIZACION2: "",
                  CLV_Nota3: 0,
                  GLONOTA3: 0,
                  IdMedioPago: vm.selectedMedio.IdMedioPago,
                  IdCompania: x.IdCompania,
                  IdDistribuidor: x.IdDistribuidor,
                  FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
                };
                pagosMaestrosFactory.actFactura(objact).then(function (dataAct) {
                  pagosMaestrosFactory.grabaFactura(objPagar)
                    .then(function (dataGraba) {
                      vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;

                      pagosMaestrosFactory
                        .nuePagoEfectivoMaestro(vm.pago, vm.efectivo, vm.cambio)
                        .then(function (dataNuevo) { });
                      if (dataGraba.AddGuardaPagoFacturaMaestroResult == 0) {
                        ngNotify.set("Factura preliminar generada exitosamente", "error");
                      } else {
                        if (vm.proceso === "RP") {
                          ContratoMaestroFactory.GetGraba_Factura_DigitalPago(vm.pago).then(function (result) {
                            var url = result.GetGraba_Factura_DigitalPagoResult.urlReporte;
                            muestraFactura(url);

                            $uibModalInstance.dismiss("cancel");
                            ngNotify.set("Factura preliminar generada exitosamente", "success");
                            $rootScope.$emit("realoadBrowse", {});
                          });
                          console.log('Pago Contado', 1);
                          /*$uibModalInstance.dismiss("cancel");
                          ngNotify.set(
                            "Factura preliminar generada exitosamente",
                            "success"
                          );
                          $rootScope.$emit("realoadBrowse", {});*/
                        } else {
                          $uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});
                        }
                      }
                    });
                });
              } else {
                ngNotify.set("No se ha saldado la factura.", "error");
              }
            });
          } else {
            if (vm.efectivo >= vm.monto) {
              var objPagar = {
                Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                ContratoMaestro: x.ContratoMaestro,
                Cajera: $localStorage.currentUser.usuario,
                IpMaquina: $localStorage.currentUser.maquina,
                Sucursal: $localStorage.currentUser.sucursal,
                Monto: vm.monto,
                GLOEFECTIVO2: vm.efectivo,
                GLOCHEQUE2: 0,
                GLOCLV_BANCOCHEQUE2: 0,
                NUMEROCHEQUE2: "",
                GLOTARJETA2: 0,
                GLOCLV_BANCOTARJETA2: 0,
                NUMEROTARJETA2: "",
                TARJETAAUTORIZACION2: "",
                CLV_Nota3: 0,
                GLONOTA3: 0,
                IdMedioPago: vm.selectedMedio.IdMedioPago,
                IdCompania: x.IdCompania,
                IdDistribuidor: x.IdDistribuidor,
                FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
              };
              pagosMaestrosFactory.actFactura(objact).then(function (dataAct) {
                pagosMaestrosFactory.grabaFactura(objPagar)
                  .then(function (dataGraba) {
                    vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;
                    pagosMaestrosFactory
                      .nuePagoEfectivoMaestro(vm.pago, vm.efectivo, vm.cambio)
                      .then(function (dataNuevo) { });
                    if (dataGraba.AddGuardaPagoFacturaMaestroResult == 0) {
                      ngNotify.set("Factura preliminar generada exitosamente", "error");
                    } else {
                      if (vm.proceso === "RP") {
                        ContratoMaestroFactory.GetGraba_Factura_DigitalPago(
                          vm.pago
                        ).then(function (result) {
                          var url =
                            result.GetGraba_Factura_DigitalPagoResult
                              .urlReporte;
                          muestraFactura(url);

                          $uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});
                        });
                        console.log('Pago Contado', 2);
                        /*$uibModalInstance.dismiss("cancel");
                        ngNotify.set("Factura preliminar generada exitosamente", "success");
                        $rootScope.$emit("realoadBrowse", {});*/
                      } else {
                        $uibModalInstance.dismiss("cancel");
                        ngNotify.set("Factura preliminar generada exitosamente", "success");
                        $rootScope.$emit("realoadBrowse", {});
                      }
                    }
                  });
              });
            } else {
              ngNotify.set("No se ha saldado la factura.", "error");
            }
          }
          break;
        case 2:
          if (x.tipo == "pagos") {
            pagosMaestrosFactory.generaFactura(obj).then(function (data) {
              vm.r1 = data.GetGrabaFacturaCMaestroResult.ClvFacturaMaestro;
              x.Clv_FacturaMaestro = vm.r1;
              objact.ClvFacturaMaestro = x.Clv_FacturaMaestro;
              if (vm.selectedBancoCheque.Clave == 0) {
                ngNotify.set("Selecciona un banco.", "error");
              } else {
                if (vm.dineroCheque == vm.monto) {
                  var objPagar = {
                    Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                    ContratoMaestro: x.ContratoMaestro,
                    Cajera: $localStorage.currentUser.usuario,
                    IpMaquina: $localStorage.currentUser.maquina,
                    Sucursal: $localStorage.currentUser.sucursal,
                    Monto: vm.monto,
                    GLOEFECTIVO2: 0,
                    GLOCHEQUE2: vm.dineroCheque,
                    GLOCLV_BANCOCHEQUE2: vm.selectedBancoCheque.Clave,
                    NUMEROCHEQUE2: vm.numeroCheque,
                    GLOTARJETA2: 0,
                    GLOCLV_BANCOTARJETA2: 0,
                    NUMEROTARJETA2: "",
                    TARJETAAUTORIZACION2: "",
                    CLV_Nota3: 0,
                    GLONOTA3: 0,
                    IdMedioPago: vm.selectedMedio.IdMedioPago,
                    IdCompania: x.IdCompania,
                    IdDistribuidor: x.IdDistribuidor,
                    FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
                  };
                  pagosMaestrosFactory
                    .actFactura(objact)
                    .then(function (dataAct) {
                      pagosMaestrosFactory.grabaFactura(objPagar)
                        .then(function (dataGraba) {
                          vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;

                          if (
                            dataGraba.AddGuardaPagoFacturaMaestroResult == 0
                          ) {
                            ngNotify.set("Factura preliminar generada exitosamente", "error");
                          } else {
                            if (vm.proceso === "RP") {
                              ContratoMaestroFactory.GetGraba_Factura_DigitalPago(
                                vm.pago
                              ).then(function (result) {
                                var url =
                                  result.GetGraba_Factura_DigitalPagoResult
                                    .urlReporte;
                                muestraFactura(url);

                                $uibModalInstance.dismiss("cancel");
                                ngNotify.set(
                                  "Factura preliminar generada exitosamente",
                                  "success"
                                );
                                $rootScope.$emit("realoadBrowse", {});
                              });
                              console.log('Pago Contado', 3);
                              /*$uibModalInstance.dismiss("cancel");
                              ngNotify.set(
                                "Factura preliminar generada exitosamente",
                                "success"
                              );
                              $rootScope.$emit("realoadBrowse", {});*/
                            } else {
                              $uibModalInstance.dismiss("cancel");
                              ngNotify.set(
                                "Factura preliminar generada exitosamente",
                                "success"
                              );
                              $rootScope.$emit("realoadBrowse", {});
                            }
                          }
                        });
                    });
                } else {
                  ngNotify.set("No se ha saldado la factura", "error");
                }
              }
            });
          } else {
            if (vm.selectedBancoCheque.Clave == 0) {
              ngNotify.set("Selecciona un banco.", "error");
            }  else {
              if (vm.dineroCheque == vm.monto) {
                var objPagar = {
                  Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                  ContratoMaestro: x.ContratoMaestro,
                  Cajera: $localStorage.currentUser.usuario,
                  IpMaquina: $localStorage.currentUser.maquina,
                  Sucursal: $localStorage.currentUser.sucursal,
                  Monto: vm.monto,
                  GLOEFECTIVO2: 0,
                  GLOCHEQUE2: vm.dineroCheque,
                  GLOCLV_BANCOCHEQUE2: vm.selectedBancoCheque.Clave,
                  NUMEROCHEQUE2: vm.numeroCheque,
                  GLOTARJETA2: 0,
                  GLOCLV_BANCOTARJETA2: 0,
                  NUMEROTARJETA2: "",
                  TARJETAAUTORIZACION2: "",
                  CLV_Nota3: 0,
                  GLONOTA3: 0,
                  IdMedioPago: vm.selectedMedio.IdMedioPago,
                  IdCompania: x.IdCompania,
                  IdDistribuidor: x.IdDistribuidor,
                  FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
                };
                pagosMaestrosFactory.actFactura(objact).then(function (dataAct) {
                  pagosMaestrosFactory.grabaFactura(objPagar)
                    .then(function (dataGraba) {
                      vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;

                      if (dataGraba.AddGuardaPagoFacturaMaestroResult == 0) {
                        ngNotify.set("Factura preliminar generada exitosamente", "error");
                      } else {
                        if (vm.proceso === "RP") {
                          ContratoMaestroFactory.GetGraba_Factura_DigitalPago(
                            vm.pago
                          ).then(function (result) {
                            var url =
                              result.GetGraba_Factura_DigitalPagoResult
                                .urlReporte;
                            muestraFactura(url);

                            $uibModalInstance.dismiss("cancel");
                            ngNotify.set(
                              "Factura preliminar generada exitosamente",
                              "success"
                            );
                            $rootScope.$emit("realoadBrowse", {});
                          });
                          console.log('Pago Contado', 4);
                          /*$uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});*/
                        } else {
                          $uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});
                        }
                      }
                    });
                });
              } else {
                ngNotify.set("No se ha saldado la factura", "error");
              }
            }
          }
          break;
        case 3:
          if (x.tipo == "pagos") {
            pagosMaestrosFactory.generaFactura(obj).then(function (data) {
              vm.r1 = data.GetGrabaFacturaCMaestroResult.ClvFacturaMaestro;
              x.Clv_FacturaMaestro = vm.r1;
              objact.ClvFacturaMaestro = x.Clv_FacturaMaestro;

              if (vm.selectedBancoTransferencia.Clave == 0) {
                ngNotify.set("Selecciona un banco", "error");
              } else if (
                vm.cuentaTransferencia == "" ||
                vm.cuentaTransferencia == undefined
              ) {
                ngNotify.set("Digita el número de cuenta por favor.", "error");
              } else if (
                vm.autorizacionTransferencia == "" ||
                vm.autorizacionTransferencia == undefined
              ) {
                ngNotify.set("Digita el número de autorizacion.", "error");
              } else {
                if (vm.dineroTransferencia == vm.monto) {
                  var objPagar = {
                    Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                    ContratoMaestro: x.ContratoMaestro,
                    Cajera: $localStorage.currentUser.usuario,
                    IpMaquina: $localStorage.currentUser.maquina,
                    Sucursal: $localStorage.currentUser.sucursal,
                    Monto: vm.monto,
                    GLOEFECTIVO2: 0,
                    GLOCHEQUE2: 0,
                    GLOCLV_BANCOCHEQUE2: 0,
                    NUMEROCHEQUE2: "",
                    GLOTARJETA2: vm.dineroTransferencia,
                    GLOCLV_BANCOTARJETA2: vm.selectedBancoTransferencia.Clave,
                    NUMEROTARJETA2: vm.cuentaTransferencia,
                    TARJETAAUTORIZACION2: vm.autorizacionTransferencia,
                    CLV_Nota3: 0,
                    GLONOTA3: 0,
                    IdMedioPago: vm.selectedMedio.IdMedioPago,
                    IdCompania: x.IdCompania,
                    IdDistribuidor: x.IdDistribuidor,
                    FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
                  };
                  pagosMaestrosFactory
                    .actFactura(objact)
                    .then(function (dataAct) {
                      pagosMaestrosFactory.grabaFactura(objPagar)
                        .then(function (dataGraba) {
                          vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;
                          if (
                            dataGraba.AddGuardaPagoFacturaMaestroResult == 0
                          ) {
                            ngNotify.set("Factura preliminar generada exitosamente", "error");
                          } else {
                            if (vm.proceso === "RP") {
                              ContratoMaestroFactory.GetGraba_Factura_DigitalPago(
                                vm.pago
                              ).then(function (result) {
                                var url =
                                  result.GetGraba_Factura_DigitalPagoResult
                                    .urlReporte;
                                muestraFactura(url);

                                $uibModalInstance.dismiss("cancel");
                                ngNotify.set(
                                  "Factura preliminar generada exitosamente",
                                  "success"
                                );
                                $rootScope.$emit("realoadBrowse", {});
                              });
                              console.log('Pago Contado', 5);
                              /*$uibModalInstance.dismiss("cancel");
                              ngNotify.set(
                                "Factura preliminar generada exitosamente",
                                "success"
                              );
                              $rootScope.$emit("realoadBrowse", {});*/
                            } else {
                              $uibModalInstance.dismiss("cancel");
                              ngNotify.set(
                                "Factura preliminar generada exitosamente",
                                "success"
                              );
                              $rootScope.$emit("realoadBrowse", {});
                            }
                          }
                        });
                    });
                } else {
                  ngNotify.set("No se ha saldado la factura", "error");
                }
              }
            });
          } else {
            if (vm.selectedBancoTransferencia.Clave == 0) {
              ngNotify.set("Selecciona un banco", "error");
            } else if (
              vm.cuentaTransferencia == "" ||
              vm.cuentaTransferencia == undefined
            ) {
              ngNotify.set("Digita el número de cuenta por favor.", "error");
            } else if (
              vm.autorizacionTransferencia == "" ||
              vm.autorizacionTransferencia == undefined
            ) {
              ngNotify.set("Digita el número de autorizacion.", "error");
            } else {
              if (vm.dineroTransferencia == vm.monto) {
                var objPagar = {
                  Clv_FacturaMaestro: x.Clv_FacturaMaestro,
                  ContratoMaestro: x.ContratoMaestro,
                  Cajera: $localStorage.currentUser.usuario,
                  IpMaquina: $localStorage.currentUser.maquina,
                  Sucursal: $localStorage.currentUser.sucursal,
                  Monto: vm.monto,
                  GLOEFECTIVO2: 0,
                  GLOCHEQUE2: 0,
                  GLOCLV_BANCOCHEQUE2: 0,
                  NUMEROCHEQUE2: "",
                  GLOTARJETA2: vm.dineroTransferencia,
                  GLOCLV_BANCOTARJETA2: vm.selectedBancoTransferencia.Clave,
                  NUMEROTARJETA2: vm.cuentaTransferencia,
                  TARJETAAUTORIZACION2: vm.autorizacionTransferencia,
                  CLV_Nota3: 0,
                  GLONOTA3: 0,
                  IdMedioPago: vm.selectedMedio.IdMedioPago,
                  IdCompania: x.IdCompania,
                  IdDistribuidor: x.IdDistribuidor,
                  FechaPago: $filter('date')(vm.FechaPago, 'yyyyMMdd') + ' ' + vm.HoraPago
                };
                pagosMaestrosFactory.actFactura(objact).then(function (dataAct) {
                  pagosMaestrosFactory.grabaFactura(objPagar)
                    .then(function (dataGraba) {
                      vm.pago = dataGraba.AddGuardaPagoFacturaMaestroResult;

                      if (dataGraba.AddGuardaPagoFacturaMaestroResult == 0) {
                        ngNotify.set("Factura preliminar generada exitosamente", "error");
                      } else {
                        if (vm.proceso === "RP") {
                          ContratoMaestroFactory.GetGraba_Factura_DigitalPago(
                            vm.pago
                          ).then(function (result) {
                            var url =
                              result.GetGraba_Factura_DigitalPagoResult
                                .urlReporte;
                            muestraFactura(url);

                            $uibModalInstance.dismiss("cancel");
                            ngNotify.set(
                              "Factura preliminar generada exitosamente",
                              "success"
                            );
                            $rootScope.$emit("realoadBrowse", {});
                          });
                          console.log('Pago Contado',6 );
                          /*$uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});*/
                        } else {
                          $uibModalInstance.dismiss("cancel");
                          ngNotify.set("Factura preliminar generada exitosamente", "success");
                          $rootScope.$emit("realoadBrowse", {});
                        }
                      }
                    });
                });
              } else {
                ngNotify.set("No se ha saldado la factura", "error");
              }
            }
          }
          break;
        default:
          console.log("sasasas");
      }
    }
  }
//Se puede usar para descartar un modal
  function cancel() {
    $uibModalInstance.dismiss("cancel");
  }

  var vm = this;
  vm.cancel = cancel;
  vm.cambioEfectivo = cambioEfectivo;
  vm.cambioCheque = cambioCheque;
  vm.cambioTransferencia = cambioTransferencia;
  vm.ok = ok;
  vm.cambioNota = cambioNota;
  vm.proceso = proceso;
  initialData();
  vm.Monedas = [{
    IdMoneda: 'MXN',
    Moneda: 'MXN'
  },{
    IdMoneda: 'USD',
    Moneda: 'USD'
  }];
}
