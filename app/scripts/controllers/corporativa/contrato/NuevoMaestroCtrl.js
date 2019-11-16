'use strict';
angular
	.module('softvApp')
	.controller('NuevoMaestroCtrl', NuevoMaestroCtrl);

function NuevoMaestroCtrl($uibModal, $rootScope, corporativoFactory, cajasFactory, $filter, ngNotify, $state, ContratoMaestroFactory) {
	var vm = this;
	vm.abrirContratos = abrirContratos;
	vm.contratos = [];
	vm.prepago = 'postpago';
	vm.reactivacion = 'manual';
	vm.tipopago = 'factura';
	vm.guardarContrato = guardarContrato;
	vm.NumExt = '';
	vm.ligados = true;
	vm.guardarBtn = false;
	vm.helpSave = false;
	vm.CambioTipoPago = CambioTipoPago;
	vm.DesReactiva = true;
	vm.MuestraReferencia = false;
	vm.CambioTipo = CambioTipo;
	vm.dolares = false;
	vm.fechaVigencia = "";
	vm.getEstadoCiudadPais = getEstadoCiudadPais;
	vm.buscarCP = buscarCP;
//funcion de inicializacion del controlador, obtiene la infomracion de las cuentas
	this.$onInit = function () {
		corporativoFactory.getDistribuidores().then(function (data) {
			vm.distribuidores = data.GetDistribuidoresResult;
		});
		corporativoFactory.getEstados().then(function (data) {
			vm.estados = data.GetMuestraEstadoResult;
		});
		corporativoFactory.getCortes().then(function (data) {
			vm.cortes = data.GetTiposCortesClientesListResult;
		});
		corporativoFactory.getTipoPagos().then(function (data) {
			vm.tipoPagos = data.GetTipoPagosFacturasListResult;
		});
		cajasFactory.dameBancos().then(function (data) {
			vm.bancos = data.GetMuestraBancosListResult;
		});
		ContratoMaestroFactory.GetCuentaCableMaestro().then(function (data) {
			vm.Clabes = data.GetCuentaCableMaestroResult;

		});

		ContratoMaestroFactory.GetUsoCFDI().then(function (data) {
			vm.listaCDFI = data.GetUsoCFDIResult;
		});


		/* 	ContratoMaestroFactory.GetCodigosPostalesMizar().then(function(data){
				vm.codigospostales=data.GetCodigosPostalesMizarResult;	
			}); */
	}

//llama a otra vista para buscar el codigo postal 
	function buscarCP() {

		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/corporativa/modalCodigoPostal.html',
			controller: 'modalCodigoPostalCtrl',
			controllerAs: '$ctrl',
			backdrop: 'static',
			keyboard: false,
			size: "sm",
			resolve: {

			}
		});
		modalInstance.result.then(function (item) {
			vm.cp = item.id_CodigoPostal;
			getEstadoCiudadPais();
		}, function () {
		});


	}
//obtiene los paices y dentro los estados y dentro los municipios y dentro las colonias 
	function getEstadoCiudadPais() {
		ContratoMaestroFactory.GetPaisesMizar(vm.cp).then(function (data) {
			console.log("GetPaisesMizar", data);
			vm.paises = data.GetPaisesMizarResult;
			vm.Pais = vm.paises[0];

			ContratoMaestroFactory.GetEstadosMizar(vm.cp).then(function (result) {
				console.log("GetEstadosMizar", result);
				vm.estados = result.GetEstadosMizarResult;
				vm.estado = vm.estados[0];

				ContratoMaestroFactory.GetMunicipiosMizar(vm.cp, vm.estado.id_Estado).then(function (data) {
					console.log("GetMunicipiosMizar", data);
					vm.ciudades = data.GetMunicipiosMizarResult;
					vm.ciudad = vm.ciudades[0];

					ContratoMaestroFactory.GetColoniasMizar(vm.cp).then(function (data) {
						console.log("GetColoniasMizar", data);
						vm.colonias = data.GetColoniasMizarResult;
						vm.colonia = vm.colonias[0];

					});

				});
			});
		});
	}
//valida que se pueda abrir un contrato y si es que si puede llama a la vista contratosLigados.html
	function abrirContratos() {
		var detalle = {};
		detalle.ContratosSoftv = vm.contratos;
		detalle.IdContratoMaestro = vm.contratoMaestro;
		
		if (vm.distribuidor == null) {
			ngNotify.set('Selecciona una distribuidor', 'error');
			return;
		}
		detalle.Distribuidor = vm.distribuidor;
		detalle.Action = 'ADD';

		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/corporativa/contratosLigados.html',
			controller: 'ContratosLigadosCtrl',
			controllerAs: '$ctrl',
			backdrop: 'static',
			keyboard: false,
			size: "lg",
			resolve: {
				detalle: function () {
					return detalle;
				}
			}
		});
	}

	$rootScope.$on('contratos_ligados', function (e, contratos) {
		vm.contratos = contratos
	});
//hace las validaciones necesarias para poder agegar el contrato maestro, si las validaciones son correctas guarda el nuevo contraro maestro
	function guardarContrato() {
		if (vm.MuestraBanco) {
			if (!vm.selectedBanco) {
				ngNotify.set('Selecciona un banco por favor.', 'error');
				return;
			} else {
				vm.clvBanco = vm.selectedBanco.Clave;
			}
		} else {
			vm.clvBanco = 0;
		}
		if (vm.MuestraAutorizacion) {
			if (!vm.autorizacion) {
				ngNotify.set('Indroduce el número de autorización.', 'error');
				return;
			} else {
				vm.Referencia2 = vm.autorizacion;
			}
		} else {
			vm.Referencia2 = '';
		}
		if (vm.prepago == 'prepago') {
			vm.prep = 1;
			vm.posp = 0;
		} else {
			vm.prep = 0;
			vm.posp = 1;
		}
		if (vm.reactivacion == 'manual') {
			vm.reacMan = 1;
			vm.reacPag = 0;
		} else {
			vm.reacMan = 0;
			vm.reacPag = 1;
		}
		if (vm.tipopago == 'estado') {
			vm.pagEdo = 1;
			vm.pagFac = 0;
		} else {
			vm.pagEdo = 0;
			vm.pagFac = 1;
		}
		if (vm.dolares) {
			vm.FacturacionDolaresAux = 1;
		} else {
			vm.FacturacionDolaresAux = 0;
		}
		var IdClabe = 0;
		if (vm.selectedClabe != undefined) {
			IdClabe = vm.selectedClabe.Id;
		}
		if (vm.EntreCalles === undefined) {
			vm.EntreCalles = '';
		}

		var auxFecha = $filter('date')(vm.fecha, 'dd/MM/yyyy');
		var fechaHoy = new Date();
		fechaHoy = $filter('date')(fechaHoy, 'dd/MM/yyyy');
		var fechaVigenciaAux = $filter('date')(vm.fechaVigencia, 'dd/MM/yyyy');
		/*if (fechaVigenciaAux <= fechaHoy) {
			ngNotify.set('La fecha de vigencia debe ser mayor a la fecha actual', 'error');
			return;
		}*/

		var contrato = {
			'objContratoMaestroFac': {
				'RazonSocial': vm.razon,
				'NombreComercial': vm.nombrecomercial,
				'Distribuidor': vm.distribuidor.Clv_Plaza,
				'Estado': (vm.estado) ? vm.estado.Descripcion : '',
				'Ciudad': (vm.ciudad) ? vm.ciudad.Descripcion : '',
				'Localidad': vm.localidad,
				'Colonia': (vm.colonia) ? vm.colonia.Descripcion : '',
				'Calle': vm.calle,
				'NumExt': vm.numeroexterior,
				'NumInt': vm.numerointerior,
				'CodigoPostal': (vm.cp) ? vm.cp : '',
				'RFC': vm.rfc,
				'Prepago': vm.prep,
				'PostPago': vm.posp,
				'DiasCredito': vm.diascredito,
				'DiasGracia': vm.diasgracia,
				'LimiteCredito': vm.limitecredito,
				'FechaFac': vm.fecha + '/01/2000',
				'PagoEdoCuetna': vm.pagEdo,
				'PagoFac': vm.pagFac,
				'TipoCorteCli': vm.tipocorte.Id,
				'ReactivarMan': vm.reacMan,
				'ReactivarPagoFac': vm.reacPag,
				'TipoPago': vm.formapago.Id,
				'Referencia': vm.Referencia,
				'Referencia2': vm.Referencia2,
				'ClvBanco': vm.clvBanco,
				'FacturacionDolares': vm.FacturacionDolaresAux,
				'EntreCalles': vm.EntreCalles,
				'Pais': (vm.Pais) ? vm.Pais.Descripcion : '',
				'Fax': vm.Fax,
				'Tel': vm.Telefono,
				'Email': vm.Email,
				'FechaVencimiento': $filter('date')(vm.fechaVigencia, 'dd/MM/yyyy'),
				'IdClabe': IdClabe,
				'id_UsoCFDI': (vm.CDFI) ? vm.CDFI.id_UsoCFDI : ''
			}
		};

		corporativoFactory.addMaestro(contrato).then(function (data) {
			vm.contratoMaestro = data.AddContratoMaestroFacResult;
			ngNotify.set('Contrato maestro agregado correctamente, ahora puedes ligar contratos.', 'success');
			vm.ligados = false;
			vm.guardarBtn = true;
			vm.helpSave = true;
		});
	}
//revisa la variable entrante y la valida, donde depende de el resultado asigna valores a elementos de la ventana 
	function CambioTipoPago(x) {
		if (x == 'postpago') {
			vm.DesReactiva = false;
			vm.reactivacion = 'manual';

		} else {
			vm.DesReactiva = true;
			vm.reactivacion = 'manual';
		}
	}
//revisa la variable entrante y la valida, donde depende de el resultado asigna valores a elementos de la ventana 
	function CambioTipo(x) {
		if (x.Cuenta == true) {
			vm.MuestraReferencia = true;
		} else {
			vm.MuestraReferencia = false;
		}
		if (x.Descripcion == 'Tarjeta') {
			vm.MuestraBanco = true;
			vm.MuestraAutorizacion = true;
		} else if (x.Descripcion == 'Cheque') {
			vm.MuestraBanco = true;
			vm.MuestraAutorizacion = false;
		} else {
			vm.MuestraBanco = false;
			vm.MuestraAutorizacion = false;
		}
	}
}