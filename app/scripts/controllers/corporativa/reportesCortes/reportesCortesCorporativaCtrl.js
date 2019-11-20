'use strict';
angular.module('softvApp')
    .controller('reportesCortesCorporativaCtrl', function ($state, ngNotify, $localStorage, reportesCortesCorporativaFactory, globalService, $sce) // servicio
    {
        var vm = this;
////funcion de inicializacion del controlador, llama a ListaDistribuidores
        this.$onInit = function () {

            ListaDistribuidores();

        }


        //------------------Distribuidores -------------------------------
//filtra la lista de distribuidores y si encuentra regresa un true y si no un falce 
        function ExisteDistribuidor(id) {
            var result = $.grep(Distribuidores, function (obj) { return obj.Clv_Plaza == id; });
            if (result.length == 0) {
                return false;
            } else {
                return true;
            }
        }
//revisa el valore de una variable donde depende de esta puede llamar a mostrarDistribuidorByUsuario
        function distribuidorPadre() {
            if (banderas.banderaDistribuidor == 1) {

                banderas.banderaDistribuidor = 0;
                Distribuidores = [];

                for (var i = 0; i < vm.DistribuidoresTable.length; i++) {
                    vm.DistribuidoresTable[i].selected = false;
                }
            }
            else if (banderas.banderaDistribuidor == 0) {
                Distribuidores = [];
                reportesCortesCorporativaFactory.mostrarDistribuidorByUsuario(clv_usuario).then(function (data) {
                    DistribuidoresTodos = data.GetDistribuidorByUsuarioResult;
                    var i;
                    for (i = 0; i < DistribuidoresTodos.length; i++) {
                        vm.DistribuidoresTable[i].selected = true;
                        AddToArray(Distribuidores, DistribuidoresTodos[i]);
                    }
                });
                banderas.banderaDistribuidor = 1;
            }
        }

//verifica que este seleccionado el distribuidor como el hijo, para poderlo eliminar 
        function distribuidorHijo(obj) {

            if (banderas.banderaDistribuidor == 1) //si es 1, está seleccionado, volver a NO SELECCIONADO
            {
                vm.distriTodo = false;  // si bandera es 1, y selecciona un hijo, eliminar a ese hijo
                if (ExisteDistribuidor(obj.Clv_Plaza)) {
                    DeleteFromArray(Distribuidores, 'Clv_Plaza', obj.Clv_Plaza);
                }
                banderas.banderaDistribuidor = 0;
            }
            else {
                AddDistribuidor(obj);
            }
        }

//si existe distribuidor lo elimina, de lo contrario lo añade 
        function AddDistribuidor(obj) {
            if (ExisteDistribuidor(obj.Clv_Plaza)) {
                DeleteFromArray(Distribuidores, 'Clv_Plaza', obj.Clv_Plaza)
            }
            else {
                AddToArray(Distribuidores, obj);
            }
        }

        var DistribuidoresTodos = [];
        //llama a mostrarDistribuidorByUsuario
        function ListaDistribuidores() {
            reportesCortesCorporativaFactory.mostrarDistribuidorByUsuario(clv_usuario).then(function (data) {
                vm.DistribuidoresTable = data.GetDistribuidorByUsuarioResult;
                DistribuidoresTodos = data.GetDistribuidorByUsuarioResult;
            });
        }
        //--------------- Sucursales ---------------------------------
//revista si hay sucursales 
        function ExisteSucursal(id) {
            var result = $.grep(Sucursales, function (obj) { return obj.Clv_Sucursal == id; });
            if (result.length == 0) {
                return false;
            } else {
                return true;
            }
        }
//revisa el valore de una variable donde depende de esta puede llamar a mostrarSucursalByUsuario
        function sucursalPadre() {

            if (banderas.banderaSucursal == 1) {
                banderas.banderaSucursal = 0;
                Sucursales = [];

                for (var i = 0; i < vm.SucursalesTable.length; i++) {
                    vm.SucursalesTable[i].selected = false;
                }
            }
            else if (banderas.banderaSucursal == 0) {
                Sucursales = [];

                reportesCortesCorporativaFactory.mostrarSucursalByUsuario(clv_usuario).then(function (data) {
                    SucursalesTodos = data.GetSucursalByUsuarioResult;
                    var i;
                    for (i = 0; i < SucursalesTodos.length; i++) {
                        vm.SucursalesTable[i].selected = true;
                        AddToArray(Sucursales, SucursalesTodos[i]);
                    }
                });
                banderas.banderaSucursal = 1;
            }
        }

//revisa si esa la sucusral donde si esta la elimina y si no la añade a la lista 

        function sucursalHijo(obj) {

            if (banderas.banderaSucursal == 1) {
                vm.sucurTodo = false;
                if (ExisteSucursal(obj.Clv_Sucursal)) {
                    DeleteFromArray(Sucursales, 'Clv_Sucursal', obj.Clv_Sucursal);
                }
                banderas.banderaSucursal = 0;
            }
            else {
                AddSucursal(obj);
            }
        }

//si la sucursal existe la elimina, si no la añade 
        function AddSucursal(obj) {

            if (ExisteSucursal(obj.Clv_Sucursal)) {
                DeleteFromArray(Sucursales, 'Clv_Sucursal', obj.Clv_Sucursal)
            }
            else {
                AddToArray(Sucursales, obj);
            }
        }

        var SucursalesTodos = [];
        //llama a mostrarSucursalByUsuario
        function ListaSucursales() {
            reportesCortesCorporativaFactory.mostrarSucursalByUsuario(clv_usuario).then(function (data) {
                vm.SucursalesTable = data.GetSucursalByUsuarioResult;
                SucursalesTodos = data.GetSucursalByUsuarioResult;
            });
        }

        //-------------
//lo añade a la lista
        function AddToArray(arr, value) {
            arr.push(value);
        }
//lo quita de la lista 
        function DeleteFromArray(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }


//limpia la lista 
        function cleanArray() {
            objPrincipal = {};
            for (var i = 0; i < vm.DistribuidoresTable.length; i++) {
                vm.DistribuidoresTable[i].selected = false;
            }

            Distribuidores = []; Sucursales = [];
            DistribuidoresTodos = []; SucursalesTodos = [];

            clv_usuario = $localStorage.currentUser.idUsuario; //siste
            banderas = {};
            banderas.clv_usuario = clv_usuario;
            banderas.banderaDistribuidor = 0;
            banderas.banderaSucursal = 0;
            vm.fechaInicial = new Date();
            vm.fechaFinal = new Date();
            vm.search = null;
            vm.inicializaCheckbox();
        }
//asigna fasle a tres valores de elementos de la vista 
        function inicializaCheckbox() {
            vm.distriTodo = false;
            vm.sucurTodo = false;
            vm.resumen = false;
        }


//limpia barra búsqueda y asigna true a otras tres propiedades de elementos de la vista 
        function showOpcion() {

            vm.search = null; //limpia barra búsqueda
            vm.pdistribuidores = true;
            vm.psucursales = true;
            vm.preporte = true;
        }

//asigna btn-default a los 6 botones que hay en la vista 
        function elMenu() {
            vm.myButton1 = 'btn-default';
            vm.myButton2 = 'btn-default';
            vm.myButton3 = 'btn-default';
            vm.myButton4 = 'btn-default';
            vm.myButton5 = 'btn-default';
            vm.myButton6 = 'btn-default';
        }
//depende de el valor contenido en valReporte si activa la info de un boton 
        function changeBgColor(valReporte) {
            vm.elMenu();
            switch (valReporte) {
                case 1:
                    vm.myButton1 = "btn-info active";
                    break;
                case 2:
                    vm.myButton2 = "btn-info active";
                    break;
                case 3:
                    vm.myButton3 = "btn-info active";
                    break;
                case 4:
                    vm.myButton4 = "btn-info active";
                    break;
                case 5:
                    vm.myButton5 = "btn-info active";
                    break;
                case 6:
                    vm.myButton6 = "btn-info active";
                    break;
            }

            reporteSeleccionado = valReporte;
            cleanArray();
            showOpcion();
            vm.pdistribuidores = false;
        }


        // 1.- DISTRIBUIDORES 
        //verifica si se selecciono un distribuidor donde si se seleciono valida el reporte seleccionado y depende de este si llama a una funcion en especial
        function filtroDistribuidores() {

            if (Distribuidores.length == 0) {
                ngNotify.set('Seleccione al menos un distribuidor', {
                    type: 'error'
                });
            } else {
                if (reporteSeleccionado == 1 || reporteSeleccionado == 2) {
                    showReporte();
                }
                else if (reporteSeleccionado == 3) {
                    showSucursales();
                }
            }
        }
//aplica los filtros de busqueda para los distribuidores
        function filtroDistribuidoresExcel() {

            if (Distribuidores.length == 0) {
                ngNotify.set('Seleccione al menos un distribuidor', {
                    type: 'error'
                });
            } else {
                if (reporteSeleccionado == 1 || reporteSeleccionado == 2) {
                    vm.search = "";
                    vm.preporte = true;
                    vm.pdistribuidores = true;
                    vm.psucursales = true;
                    crearObjParametros();
                    reportesCortesCorporativaFactory.getXml(reporteSeleccionado, objPrincipal, Distribuidores, Sucursales).then(function (data) {
                        OtrosFiltrosXml = data.GetCreateXmlBeforeReporteCorporativaResult[0];
                        distribuidoresXML = data.GetCreateXmlBeforeReporteCorporativaResult[1];
                        sucursalesXml = data.GetCreateXmlBeforeReporteCorporativaResult[2];
                        reportesCortesCorporativaFactory.creaReporteExcel(clv_usuario, reporteSeleccionado, OtrosFiltrosXml, distribuidoresXML, sucursalesXml).then(function (data) {

                            var urlReporte = '';

                            if (reporteSeleccionado == 1) {
                                urlReporte = data.GetReporte_GeneralExcelResult;
                            }
                            else if (reporteSeleccionado == 2) {

                                urlReporte = data.GetReporte_GeneralDeVentasExcelResult;
                            }
                            else if (reporteSeleccionado == 3) {
                                urlReporte = data.GetReporte_ResumenIngresoSucursalResult;
                            }

                            vm.url = globalService.getUrlReportes() + '/Reportes/' + urlReporte;
                            //$window.open(vm.url, '_self');

                            var isChrome = !!window.chrome && !!window.chrome.webstore;
                            var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                            var isEdge = !isIE && !!window.StyleMedia;


                            if (isChrome) {
                                var url = window.URL || window.webkitURL;

                                var downloadLink = angular.element('<a></a>');
                                downloadLink.attr('href', vm.url);
                                downloadLink.attr('target', '_self');
                                downloadLink.attr('download', 'CorteFacturacionCorporativa.xlsx');
                                downloadLink[0].click();
                            } else if (isEdge || isIE) {
                                window.navigator.msSaveOrOpenBlob(vm.url, 'CorteFacturacionCorporativa.xlsx');

                            } else {
                                var fileURL = vm.url;
                                window.open(fileURL);
                            }
                        });
                    });
                }
                else if (reporteSeleccionado == 3) {
                    showSucursales();
                }
            }
        }
//verifia que se haya seleccionado al menos una sucursal, si es asi llama a showReporte

        function filtroSucursales() {

            if (Sucursales.length == 0) {
                ngNotify.set('Seleccione al menos una sucursal', {
                    type: 'error'
                });
            } else {
                showReporte();
            }
        }

        // 2.- SUCURSALES
        //asigna valores a elementos de la vista y llama a ListaSucursales
        function showSucursales() {
            vm.search = "";
            vm.pdistribuidores = true;
            vm.psucursales = false;
            ListaSucursales();
        }

        // 3.- REPORTE    
        ////asigna valores a elementos de la vista y llama a crearObjParametros y crearXml
        function showReporte() {

            vm.search = "";
            vm.preporte = false;
            vm.pdistribuidores = true;
            vm.psucursales = true;

            crearObjParametros();
            crearXml();
        }
//crea los parametros 
        function crearObjParametros() {

            if (reporteSeleccionado >= 1 && reporteSeleccionado <= 3)//1 general, 3 resumen sucursales
            {

                var D1 = vm.fechaInicial;
                var month = D1.getUTCMonth() + 1;
                var day = D1.getUTCDate();
                var year = D1.getUTCFullYear();
                var fechaInicialYMD = year + '/' + month + '/' + day;

                var D2 = vm.fechaFinal;
                var month = D2.getUTCMonth() + 1;
                var day = D2.getUTCDate();
                var year = D2.getUTCFullYear();
                var fechaFinalYMD = year + '/' + month + '/' + day;

                objPrincipal.fecha_ini = fechaInicialYMD;
                objPrincipal.fecha_fin = fechaFinalYMD;

                if (vm.dolares == undefined || vm.dolares == false) {
                    objPrincipal.dolares = 0;
                }
                else {
                    objPrincipal.dolares = 1
                }
                //objPrincipal.clv_reporte = 2;

                if (vm.status == true) {
                    objPrincipal.Op_ordena = 2;
                }
                else {
                    objPrincipal.Op_ordena = 1;
                }

                if (vm.resumen == true) {
                    objPrincipal.Resumen = 1;
                }
                else {
                    objPrincipal.Resumen = 0;
                }

            }

        }
//crea el xml
        function crearXml() {
            console.log(objPrincipal);
            reportesCortesCorporativaFactory.getXml(reporteSeleccionado, objPrincipal, Distribuidores, Sucursales).then(function (data) {
                console.log(data.GetCreateXmlBeforeReporteCorporativaResult[0]);
                OtrosFiltrosXml = data.GetCreateXmlBeforeReporteCorporativaResult[0];
                distribuidoresXML = data.GetCreateXmlBeforeReporteCorporativaResult[1];
                sucursalesXml = data.GetCreateXmlBeforeReporteCorporativaResult[2];

                realizaReporte();

            });
        }


//depende del reporte seleccionado, cambia la url 
        function realizaReporte() {

            reportesCortesCorporativaFactory.creaReporte(clv_usuario, reporteSeleccionado, OtrosFiltrosXml, distribuidoresXML, sucursalesXml).then(function (data) {

                var urlReporte = '';

                if (reporteSeleccionado == 1) {
                    urlReporte = data.GetReporte_GeneralResult;
                }
                else if (reporteSeleccionado == 2) {

                    urlReporte = data.GetReporte_GeneralDeVentasResult;
                }
                else if (reporteSeleccionado == 3) {
                    urlReporte = data.GetReporte_ResumenIngresoSucursalResult;
                }

                vm.reporteUrl = $sce.trustAsResourceUrl(globalService.getUrlReportes() + '/reportes/' + urlReporte);
            });
        }


        showOpcion();

        vm.ExisteDistribuidor = ExisteDistribuidor;
        vm.distribuidorPadre = distribuidorPadre;
        vm.distribuidorHijo = distribuidorHijo;
        vm.AddDistribuidor = AddDistribuidor;
        vm.ListaDistribuidores = ListaDistribuidores;

        vm.ExisteSucursal = ExisteSucursal;
        vm.sucursalPadre = sucursalPadre;
        vm.sucursalHijo = sucursalHijo;
        vm.AddSucursal = AddSucursal;
        vm.ListaSucursales = ListaSucursales;

        vm.AddToArray = AddToArray;
        vm.DeleteFromArray = DeleteFromArray;

        vm.cleanArray = cleanArray;
        vm.showOpcion = showOpcion;
        vm.changeBgColor = changeBgColor;

        var OtrosFiltrosXml = "";
        var distribuidoresXML = "";
        var sucursalesXml = "";
        var reporteSeleccionado = 1; //reporte seleccionado 
        var objPrincipal = {};
        var Distribuidores = [];
        var Sucursales = [];
        var clv_usuario = $localStorage.currentUser.idUsuario;
        var banderas = {};
        banderas.clv_usuario = clv_usuario;
        banderas.banderaDistribuidor = 0;
        banderas.banderaSucursal = 0;

        vm.fechaInicial = new Date();
        vm.fechaFinal = new Date();

        vm.opcReporteArray = [
            { name: 'Resumen', value: '1' }
        ];
        vm.opcReporte = vm.opcReporteArray[0];

        vm.myButton1 = 'btn-info active';
        reporteSeleccionado = 1;
        vm.myButton2 = 'btn-default';
        vm.myButton3 = 'btn-default';
        vm.myButton4 = 'btn-default';
        vm.myButton5 = 'btn-default';
        vm.myButton6 = 'btn-default';

        vm.inicializaCheckbox = inicializaCheckbox;
        vm.elMenu = elMenu;
        vm.filtroDistribuidores = filtroDistribuidores;
        vm.filtroSucursales = filtroSucursales;
        vm.showReporte = showReporte;
        vm.crearObjParametros = crearObjParametros;
        vm.status = status;
        vm.crearXml = crearXml;
        vm.filtroDistribuidoresExcel = filtroDistribuidoresExcel;
    });
