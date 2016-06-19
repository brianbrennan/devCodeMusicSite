(function(){
	angular.module('globalsService', [])

	.factory('Globals', function(){
		var factory = {};

		factory.API_ROOT = 'http://localhost:8080';


		return factory;
	});
})();