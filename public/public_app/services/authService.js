(function(){
	angular.module('authService', ['globalsService'])

	.factory('Auth', function($http, $q, AuthToken, Globals){

		var factory = {};

		factory.login = function(username, password){
			return $http.post(Globals.API_ROOT + '/api/users/authenticate', {
				username: username,
				password: password
			})
			.success(function(data){
				AuthToken.setToken(data.token);
				return data;
			});
		};

		factory.logout = function(){
			AuthToken.setToken();
		};

		factory.isLoggedIn = function(){
			if(AuthToken.getToken())
				return true;
			return false
		};

		factory.getUser = function(){
			if(AuthToken.getToken())
				return $http.get(Globals.API_ROOT + '/api/users/me', {cache: true});
			else
				return $q.reject({message: 'User has no token'});
		};

		return factory;
	})

	.factory('AuthToken', function($window){

		var factory = {};

		factory.getToken = function(){
			return $window.localStorage.getItem('token');
		};

		factory.setToken = function(token){
			if(token)
				$window.localStorage.setItem('token', token);
			else
				$window.localStorage.removeItem('token');
		};

		return factory;
	})

	.factory('AuthInterceptor', function($q, $location, AuthToken){

		var factory = {};

		factory.request = function(config){

			var token = AuthToken.getToken();

			if(token)
				config.headers['x-access-token'] = token;

			return config;
		};

		factory.responseError = function(response){
			if(response.status == 403)
				$location.path('/login');

			return $q.reject(response);
		};

		return factory;
	});

})();
