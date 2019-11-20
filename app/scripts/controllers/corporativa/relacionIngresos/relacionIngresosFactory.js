angular
  .module('softvApp')
  .factory('relacionIngresosFactory', relacionIngresosFactory);

function relacionIngresosFactory($q,$http,$localStorage,globalService ) {

  var factory = {};
  var paths = {
    GetRelacionIngresosMaestro: '/RelacionIngresosMaestro/GetRelacionIngresosMaestro'
  };
//obtiene la relacion de ingresos maestro 
  factory.GetRelacionIngresosMaestro = function(Distribuidores,FechaInicial,FechaFinal,Dolares,ExentoIVA) {
			var deferred = $q.defer();
			var user = $localStorage.currentUser.idUsuario;
			var Parametros = {
				'Distribuidores': Distribuidores,
				'FechaInicial': FechaInicial,
                'FechaFinal':FechaFinal,
				'Dolares':Dolares,
				'ExentoIVA':ExentoIVA
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.GetRelacionIngresosMaestro, JSON.stringify(Parametros), config).then(function(response) {
				deferred.resolve(response.data);
			}).catch(function(response) {
				deferred.reject(response.data);
			});

			return deferred.promise;
		};

  return factory;


}
