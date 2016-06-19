(function(){
	var route = angular.module('app.routes', ['ngRoute']);

	route.config(function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'public_app/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})

		.when('/login', {
			templateUrl: 'public_app/views/login.html',
			controller: 'loginController',
			controllerAs: 'login'
		})
	});
})();