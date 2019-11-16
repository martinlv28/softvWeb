'use strict';

function ContratosLigadosCtrl($uibModalInstance, $uibModal, $scope, $rootScope, corporativoFactory, detalle, $state, ngNotify, ContratoMaestroFactory, $timeout, $localStorage) {
////funcion de inicializacion del controlador, hace unas asignaciones y validaciones, despues recorre todos los contratos de softv para la obtencion de datos
  function Init() {
    vm.contratos = [];
    vm.displayCollection = [];
    vm.Distribuidor = detalle.Distribuidor;
    vm.ContratoMaestro = detalle.IdContratoMaestro;
    vm.Prueba = Prueba;
    vm.ContratosEliminados = [];
    vm.sortKey = 'Nivel';
    if (detalle.Action == "EDIT") {
      vm.showokbtn = false;
      vm.showeditbtn = true;
    }
    if (detalle.Action == "ADD") {
      vm.showokbtn = true;
      vm.showeditbtn = false;
    }
    for (var a = 0; a < detalle.ContratosSoftv.length; a++) {
      var contrato = {};
      contrato.CONTRATO = detalle.ContratosSoftv[a].ContratoCom;
      contrato.Nombre = detalle.ContratosSoftv[a].NombreCli;
      contrato.Apellido_Materno = '';
      contrato.Apellido_Paterno = '';
      contrato.ContratoBueno = detalle.ContratosSoftv[a].ContratoReal;
      contrato.Nivel = detalle.ContratosSoftv[a].Nivel;
      contrato.Proporcional = detalle.ContratosSoftv[a].Proporcional;
      contrato.Parcialidades = detalle.ContratosSoftv[a].Parcialidades;
      vm.contratos.push(contrato);
      vm.displayCollection.push(contrato);
    }
    sortByKey(vm.contratos, 'Nivel');
    sortByKey(vm.displayCollection, 'Nivel');
  }
//imprime en consola, solo para pruebas 
  function Prueba() {
    console.log('vm.contratos', vm.contratos);
    console.log('vm.displayCollection', vm.displayCollection);
  }
//valida si es ADD, si es llama a maestroEditar 
  function cancel() {
    if (detalle.Action == 'ADD') {
      $state.go('home.corporativa.maestroEditar', {id: detalle.IdContratoMaestro});
      $uibModalInstance.dismiss('cancel');
      //$uibModalInstance.close();
    }
    else {
      //$uibModalInstance.close();
      $uibModalInstance.dismiss('cancel');
    }
    
  }
  $rootScope.$on('contrato_proporcional', function (e, contrato) {
    var max = 0;
    vm.contratos.forEach(function (item, index) {
      if (item.Nivel > max) {
        max = item.Nivel;
      }
    });
    contrato.Nivel = max + 1;
    vm.contratos.push(contrato);
    vm.displayCollection.push(contrato);
  });

  $scope.$on("agregar_contrato", function (e, contrato) {
    ValidaContrato(contrato);
  });

//ordena lo obtenido de los parametros 
  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

//revisara el contrato que no este asignado, si no lo esta llama a la vista ModalProporcional
  function ValidaContrato(contrato) {
    var aux = 0;
    vm.contratos.forEach(function (item) {
      if (contrato.CONTRATO == item.CONTRATO) {
        aux += 1;
      }
    });
    if (aux > 0) {
      ngNotify.set('El contrato ya se encuentra asignado al contrato maestro', 'error');
    }
    if (aux == 0) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/corporativa/ModalProporcional.html',
        controller: 'ModalProporcionalCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        //windowClass: 'app-modal-window',
        keyboard: false,
        size: "sm",
        resolve: {
          contrato: function () {
            return contrato;
          }
        }

      });
    }

  };
//llama a la vista buscaContrato.html
  function clientesModal() {
    var detalle = {};
    detalle.contratos = vm.contratos;
    detalle.Distribuidor = vm.Distribuidor;
    detalle.ContratoMaestro = vm.ContratoMaestro;
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/corporativa/buscaContrato.html',
      controller: 'BuscaContratoLCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      windowClass: 'app-modal-window',
      keyboard: false,
      size: "lg",
      resolve: {
        contratos: function () {
          return detalle;
        }
      }
    });
  }
//valida si se introducio algun contrato y si los hay los liga con el contrato maestro 
  function ok() {
    if (vm.contratos.length > 0) {
      var contratos = [];
      var arrContratos = [];
      vm.contratos.forEach(function (item, index) {
        contratos.push({
          Contrato: item.ContratoBueno,
          Nivel: item.Nivel,
          Proporcional: item.Proporcional,
          Parcialidades: item.Parcialidades
        });
        if ((index % 1000) == 0 && index != 0) {
          arrContratos.push(contratos);
          contratos = [];
        }
      });
      if (contratos.length > 0) {
        arrContratos.push(contratos);
      }
      corporativoFactory.ligarContratosMultiple(detalle.IdContratoMaestro, arrContratos).then(function (data) {
        ngNotify.set('Los Contratos fueron ligados correctamente al contrato maestro.', 'success');

        //$uibModalInstance.dismiss('cancel');
      });
      detalle.BndGuardo = true;
    } else {
      ngNotify.set('Introduce al menos un contrato.', 'error');
    }

  }
//Primero editam los contratos existentes, después elimina los que quitaron
  function edit() {
    //Primero editamos los contratos existentes

    var contratos = [];
    var arrContratos = [];
    vm.contratos.forEach(function (item, index) {
      contratos.push({
        Contrato: item.CONTRATO,
        Nivel: item.Nivel,
        Proporcional: item.Proporcional,
        Parcialidades: item.Parcialidades
      });
      if ((index % 1000) == 0 && index != 0) {
        arrContratos.push(contratos);
        contratos = [];
      }
    });
    if (contratos.length > 0) {
      arrContratos.push(contratos);
    }
    //Después eliminamos los que quitaron
    if (vm.ContratosEliminados.length > 0) {
      corporativoFactory.EliminaContratosLigados(detalle.IdContratoMaestro, vm.ContratosEliminados, vm.Distribuidor.Clv_Plaza).then(function (data) {
        corporativoFactory.UpdateRelContratoMultiple(detalle.IdContratoMaestro, arrContratos, vm.Distribuidor.Clv_Plaza).then(function (data) {
          ngNotify.set('Los Contratos fueron ligados correctamente al contrato maestro.', 'success');
          vm.ContratosEliminados = [];
          //$state.go('home.corporativa.maestro');
          //$uibModalInstance.dismiss('cancel');
        });
      });
    }
    else {
      corporativoFactory.UpdateRelContratoMultiple(detalle.IdContratoMaestro, arrContratos, vm.Distribuidor.Clv_Plaza).then(function (data) {
        ngNotify.set('Los Contratos fueron ligados correctamente al contrato maestro.', 'success');
        //$state.go('home.corporativa.maestro');
        //$uibModalInstance.dismiss('cancel');
      });
    }
  }
//resive el contrato y lo elimina de la lista 
  function eliminarContrato(Contrato) {
    var indexE = 0;
    //console.log('Contrato', Contrato);
    vm.contratos.forEach(function (item, index) {
      if (item.CONTRATO == Contrato) {
        indexE = index;
        if (detalle.Action == "EDIT") {
          vm.ContratosEliminados.push({
            Contrato: item.CONTRATO,
            Nivel: item.Nivel,
            Proporcional: item.Proporcional
          });
        }
      }
    });

    vm.contratos.splice(indexE, 1);
    vm.displayCollection.splice(indexE, 1);
  }
//se valida que el archivo sea valido y despues muestra los contratos validos 
  function ValidaArchivo() {
    var files = $("#inputFile2").get(0).files;
    if (files.length == 0) {
      ngNotify.set('Se necesita seleccionar un archivo válido', 'error');
      return;
    }

    ContratoMaestroFactory.UpdateFile(files, detalle.IdContratoMaestro, vm.Distribuidor.Clv_Plaza).then(function (data) {
      if (data.ContratosValidos.length > 0) {
        ngNotify.set('Se encontraron ' + data.ContratosValidos.length + ' contratos válidos', 'grimace');
        //vm.contratos = [];
        for (var i = 0; i < data.ContratosValidos.length; i++) {

          var aux = 0;
          vm.contratos.forEach(function (item) {
            if (data.ContratosValidos[i].ContratoCom == item.CONTRATO) {
              aux += 1;
            }
          });
          if (aux == 0) {
            var contrato = {};
            contrato.CONTRATO = data.ContratosValidos[i].ContratoCom;
            contrato.Nombre = data.ContratosValidos[i].Nombre;
            contrato.Apellido_Materno = '';
            contrato.Apellido_Paterno = '';
            contrato.ContratoBueno = data.ContratosValidos[i].ContratoReal;
            contrato.Nivel = data.ContratosValidos[i].Nivel;
            contrato.Proporcional = data.ContratosValidos[i].Proporcional2;
            contrato.Parcialidades = data.ContratosValidos[i].Parcialidades;
            vm.contratos.push(contrato);
          }
          vm.displayCollection = vm.contratos;
        }


      }

      if (data.ContratosNoValidos.length > 0) {
        vm.FileErrors = data.ContratosNoValidos;
      } else {
        vm.FileErrors = [];
      }

    });
  }
//hace una validacion y si se cumple llama a la funcion swapArrayElements
  function cambioNivel() {
    if (vm.contratos.length > 0) {
      var indexA = vm.Nivelant - 1;
      var indexB = vm.Nivelnue - 1;

      swapArrayElements(vm.contratos, indexA, indexB);
    }

  }
//intercambia el contenido de los parametros resividos 
  var swapArrayElements = function (arr, indexA, indexB) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
  };

  var vm = this;
  vm.cancel = cancel;
  vm.ok = ok;
  vm.clientesModal = clientesModal;
  vm.eliminarContrato = eliminarContrato;
  vm.contratos = [];
  Init();
  vm.edit = edit;
  vm.ValidaArchivo = ValidaArchivo;
  vm.cambioNivel = cambioNivel;
}
angular.module('softvApp').controller('ContratosLigadosCtrl', ContratosLigadosCtrl)
  .filter('myStrictFilter', function ($filter, $rootScope) {
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
