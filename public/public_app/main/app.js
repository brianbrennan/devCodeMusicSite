(function(){

	var app = angular.module('devCode', ['app.routes', 'homeCtrl','loginCtrl', 'userService', 'authService', 'globalsService'])

	.config(function($httpProvider){
		$httpProvider.interceptors.push('AuthInterceptor');
	});
})();