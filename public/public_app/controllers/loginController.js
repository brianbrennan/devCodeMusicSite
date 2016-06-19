(function(){
	angular.module('loginCtrl', ['authService', 'userService'])

	.controller('loginController', function($http, $scope, $rootScope, Auth, User, $location){
		var vm = this;

		vm.doLogin = function(){
			Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				$location.path('/');
			})
			.error(function(err){
				console.log(err);
			});
		};
	});

})();