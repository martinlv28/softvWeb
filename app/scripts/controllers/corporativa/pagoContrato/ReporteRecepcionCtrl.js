'use strict';
angular.module('softvApp').controller('ReporteRecepcionCtrl', ReporteRecepcionCtrl)
    .filter('myStrictFilter', function ($filter) {
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

function ReporteRecepcionCtrl($uibModal, ngNotify, inMenu, pagosMaestrosFactory, $timeout, $filter) {
//llama a la funcion buscarPagos con parametros espesificos 
    function saldadas() {
        var parametros;
        if (vm.pendientes == 1) {
            parametros = {
                'Fecha': '',
                'Ticket': '',
                'ContratoMaestro': 0,
                'Cliente': '',
                'Op': 5,
                'Saldada2': 1,
                'IdMedioPago': 0,
                'ContratoCompania': 0,
                'FechaFin': ''
            };
            pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                vm.pagar = true;
                vm.displayCollection = [].concat(vm.pagos);

                vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                vm.selectedPredicate = vm.predicates[0];
            });

        } else if (vm.pendientes == 2) {
            parametros = {
                'Fecha': '',
                'Ticket': '',
                'ContratoMaestro': 0,
                'Cliente': '',
                'Op': 5,
                'Saldada2': 0,
                'IdMedioPago': 0,
                'ContratoCompania': 0,
                'FechaFin': ''
            };
            pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                vm.pagar = false;
                vm.displayCollection = [].concat(vm.pagos);

                vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                vm.selectedPredicate = vm.predicates[0];
            });

        }
    }
//llama a buscarPagos en base a filtros 
    function buscaContrato(opcion) {
        var parametros;
        if (opcion == 2) {
            if (vm.Ticket == undefined || vm.Ticket == '') {
                ngNotify.set('Seleccione un ticket.', 'error');
            } else {
                parametros = {
                    'Fecha': '',
                    'Ticket': vm.Ticket,
                    'ContratoMaestro': 0,
                    'Cliente': '',
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': 0,
                    'FechaFin': ''
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                    console.log('vm.pagos',vm.pagos);
                });

            }
        } else if (opcion == 3) {
            if (vm.ContratoMaestro == undefined || vm.ContratoMaestro == '') {
                ngNotify.set('Seleccione un contrato.', 'error');
            } else {
                parametros = {
                    'Fecha': '',
                    'Ticket': '',
                    'ContratoMaestro': vm.ContratoMaestro,
                    'Cliente': '',
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': 0,
                    'FechaFin': ''
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                });

            }
        } else if (opcion == 4) {
            if (vm.Cliente == undefined || vm.Cliente == '') {
                ngNotify.set('Seleccione un cliente.', 'error');
            } else {
                parametros = {
                    'Fecha': '',
                    'Ticket': '',
                    'ContratoMaestro': 0,
                    'Cliente': vm.Cliente,
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': 0,
                    'FechaFin': ''
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura',
                    'MonedaF',  
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                });

            }
        } else if (opcion == 1) {
            if (vm.Fecha == undefined || vm.Fecha == '') {
                ngNotify.set('Seleccione una fecha de facturación.', 'error');
            } else {
                vm.auxFechaInicio = $filter('date')(vm.Fecha, 'dd/MM/yyyy');
                vm.auxFechaFin = $filter('date')(vm.FechaFin, 'dd/MM/yyyy');
                parametros = {
                    'Fecha': vm.auxFechaInicio,
                    'Ticket': '',
                    'ContratoMaestro': 0,
                    'Cliente': '',
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': 0,
                    'FechaFin': vm.auxFechaFin
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                });

            }
        } else if (opcion == 6) {
            if (vm.FechaPago == undefined || vm.Fecha == '') {
                ngNotify.set('Seleccione una fecha de pago.', 'error');
            } else {
                vm.auxFechaPago = $filter('date')(vm.FechaPago, 'dd/MM/yyyy');
                vm.auxFechaPagoFin = $filter('date')(vm.FechaPagoFin, 'dd/MM/yyyy');
                parametros = {
                    'Fecha': vm.auxFechaPago,
                    'Ticket': '',
                    'ContratoMaestro': 0,
                    'Cliente': '',
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': 0,
                    'FechaFin': vm.auxFechaPagoFin
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                });

            }
        } else if (opcion == 7) {
            if (vm.ContratoCliente == undefined || vm.Fecha == '') {
                ngNotify.set('Seleccione un contrato de cliente.', 'error');
            } else {
                parametros = {
                    'Fecha': '',
                    'Ticket': '',
                    'ContratoMaestro': 15,
                    'Cliente': '',
                    'Op': opcion,
                    'Saldada2': 0,
                    'IdMedioPago': 0,
                    'ContratoCompania': vm.ContratoCliente,
                    'FechaFin': ''
                };
                pagosMaestrosFactory.buscarPagos(parametros).then(function (data) {
                    vm.pagos = data.GetBuscaFacturasMaestroConsultaListResult;
                    vm.displayCollection = [].concat(vm.pagos);

                    vm.predicates = ['ContratoMaestro', 
                    'Ticket', 
                    'Cliente', 
                    'Tipo', 
                    'FechaFacturacion', 
                    'FechaVencimiento', 
                    'ImporteFactura', 
                    'MonedaF', 
                    'TotalAbonado', 
                    'TotalNotas', 
                    'pendiente', 
                    'Clv_Pago', 
                    'Sucursal', 
                    'Cajera', 
                    'MedioPago', 
                    'ImportePago', 
                    'MonedaP', 
                    'FechaPago', 
                    'Contrato',
                    'ImporteFacCliente', 
                    'MontoAbono', 
                    'PorPagar', 
                    'Saldada'];
                    vm.selectedPredicate = vm.predicates[0];
                });
            }
        }
        vm.Ticket = '';
        vm.ContratoMaestro = null;
        vm.Cliente = '';
        $('.buscarContrato').collapse('hide');
    }
//primero borra elementos de pagos despues llama a initArray y despues los añade 
    function crearTodoAsCsv() {
        $timeout(function () {
            for (var i = 0; i < vm.pagos.length; i++) {
                delete vm.pagos[i].BaseIdUser;
                delete vm.pagos[i].BaseRemoteIp;
                delete vm.pagos[i].$$hashKey;
                vm.pagos[i].pendiente = vm.pagos[i].ImporteFactura - (vm.pagos[i].TotalAbonado + vm.pagos[i].TotalNotas);
            }

            initArray();

            for (var i = 0; i < vm.pagos.length; i++) {
                vm.arrayReporte.push(vm.pagos[i]);
            }

            angular.element('#csvDos').triggerHandler('click');
        });
    }
//
    function initArray() {
        vm.arrayReporte = [];
        vm.arrayReporte = [{
            'ContratoMaestro': 'Contrato Maestro',
            'Ticket': 'Ticket',
            'Cliente': 'Cliente',
            'Tipo': 'Tipo',
            'FechaFacturacion': 'Fecha de Facturacion',
            'FechaVencimiento': 'Fecha de Vencimiento',
            'ImporteFactura': 'Importe de la Factura',
            'MonedaF': 'Moneda',
            'TotalAbonado': 'Total Abonado',
            'TotalNotas': 'Total Notas de Crédito',
            'pendiente': 'Saldo Pendiente',
            'Clv_Pago' : 'Ticket Pago/Nota', 
            'Sucursal': 'Sucursal',
            'Cajera': 'Cajera',
            'MedioPago': 'Medio de Pago',
            'ImportePago': 'Importe de Pago',
            'MonedaP': 'Moneda Pago',
            'FechaPago': 'Fecha de Pago',
            'Contrato': 'Contrato',
            'ImporteFacCliente': 'Importe de Facactura Cliente',
            'MontoAbono': 'Monto Abono',
            'PorPagar': 'Por Pagar',
            'Saldada': 'Saldada'
        }];
    }

    function createPdfTodo() {
        var rows = [[0, 0, 0, 0, 0, 0,]];
        var r = 1;
        var c = 0;
        var ro = 0;
        ro = vm.pagos.length;
        var cols = 21;
        var columns = ['Contrato Maestro', 'Ticket', 'Cliente', 'Tipo', 'Fecha de Facturacion', 'Fecha de Vencimiento', 'Importe Factura', 'Moneda', 'Total Abonado','Total Notas de Crédito', 'Pendiente', 'Ticket Pago/Nota', 'Sucursal', 'Cajera', 'Medio de Pago', 'Importe Pago', 'Moneda Pago', 'Fecha de Pago', 'Importe de la Fac. Cliente', 'Monto del Abono', 'Por Pagar', 'Saldada'];
        for (var i = r; i < ro; i++) {
            rows.push([]);
        }
        for (var i = 0; i < ro; i++) {
            rows[i][0] = vm.pagos[i].ContratoMaestro;
            rows[i][1] = vm.pagos[i].Ticket;
            rows[i][2] = vm.pagos[i].Cliente;
            rows[i][3] = vm.pagos[i].Tipo;
            rows[i][4] = vm.pagos[i].FechaFacturacion;
            rows[i][5] = vm.pagos[i].FechaVencimiento;
            rows[i][6] = vm.pagos[i].ImporteFactura;
            rows[i][7] = vm.pagos[i].MonedaF;
            rows[i][9] = vm.pagos[i].TotalAbonado;
            rows[i][10] = vm.pagos[i].TotalNotas;
            rows[i][11] = vm.pagos[i].pendiente;
            rows[i][12] = vm.pagos[i].Clv_Pago;
            rows[i][13] = vm.pagos[i].Sucursal;
            rows[i][14] = vm.pagos[i].Cajera;
            rows[i][15] = vm.pagos[i].MedioPago;
            rows[i][16] = vm.pagos[i].ImportePago;
            rows[i][17] = vm.pagos[i].MonedaP;
            rows[i][18] = vm.pagos[i].FechaPago;
            rows[i][19] = vm.pagos[i].ImporteFacCliente;
            rows[i][20] = vm.pagos[i].MontoAbono;
            rows[i][21] = vm.pagos[i].PorPagar;
            rows[i][22] = vm.pagos[i].Saldada2;
        }
        var doc = new jsPDF({
            orientation: 'landscape',
            format: 'A4'
        });
        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
            var str = "Page " + data.pageCount;
            if (typeof doc.putTotalPages === 'function') {
                str = str + " of " + totalPagesExp;
            }
            doc.setFontSize(9);
            doc.text(doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 8, str);
        };
        // doc.addImage(img, 'jpeg', 5, 5, 40, 15);
        doc.setFontSize(14);
        doc.setFontType("bold");
        var fontSize = doc.internal.getFontSize(); // Get current font size
        var pageWidth = doc.internal.pageSize.width;
        var txtWidth = doc.getStringUnitWidth(reportHeaderPdf) * fontSize / doc.internal.scaleFactor;
        var x = (pageWidth - txtWidth) / 2;    // Calculate text's x coordinate    
        doc.text(reportHeaderPdf, x, 14);   // Posición text at x,y
        var laFechaHoy = '07/05/2017';
        doc.setFontSize(11);
        doc.setFontType("normal");
        doc.text(doc.internal.pageSize.width - 45, 20, laFechaHoy);
        doc.setPage(1);
        jsPDF.autoTableSetDefaults({
            headerStyles:
            {
                fontSize: 8.2
            },
            bodyStyles: {
                fontSize: 7.4
            }
        });
        doc.autoTable(columns, rows, {
            startY: 27,
            theme: 'plain',
            styles: {
                overflow: 'linebreak',
            },
            columnStyles: {
                21: { columnWidth: 98 },
            },
            margin: { top: 10, right: 10, bottom: 16, left: 10 },
            addPageContent: pageContent
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.save(vm.filename + '.pdf');
    }

    function getImageDataURL() {
        var url = document.getElementById("pdflogoimage").src;
        var data, canvas, ctx;
        img.onload = function () {
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            data = canvas.toDataURL();
        }
        img.src = url;
    }

    function enterContrato(event, opcion) {
        if (event.which === 13) {
            buscaContrato(opcion);
        }
    }

    // this.$onInit = function () {
    //     getImageDataURL();
    // }

    var vm = this;
    vm.buscaContrato = buscaContrato;
    vm.saldadas = saldadas;
    vm.crearTodoAsCsv = crearTodoAsCsv;
    vm.createPdfTodo = createPdfTodo;
    vm.filename = 'Reporte_de_pagos';
    var reportHeaderPdf = "Reporte de Pagos";
    vm.csvDosHide = true;
    var img = new Image();
    img.crossOrigin = "";
    vm.enterContrato = enterContrato;
}