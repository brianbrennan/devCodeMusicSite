(function(){
	angular.module('userService', ['globalsService'])

	.factory('User', function($http, Globals){

		var factory = {};

		factory.getAll = function(){
			return $http.get('/api/users');
		};

		factory.getMe = function(){
			return $http.get('/api/users/me');
		};

		return factory;
	});
})();