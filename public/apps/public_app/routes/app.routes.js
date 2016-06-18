(function(){
	var route = angular.module('app.routes', ['ngRoute']);

	route.config(function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'apps/public_app/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})
	});
})();