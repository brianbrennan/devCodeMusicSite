(function(){
	var route = angular.module('app.routes', ['ngRoute']);

	route.config(function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'admin_app/views/home.html',
			controller: 'adminHomeController',
			controllerAs: 'adminHome'
		})
	});
})();