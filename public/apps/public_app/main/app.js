(function(){

	var app = angular.module('devCode', ['app.routes', 'homeCtrl', 'userService', 'authService', 'globalsService'])

	.config(function($httpProvider){
		$httpProvider.interceptors.push('AuthInterceptor');
	});
})();