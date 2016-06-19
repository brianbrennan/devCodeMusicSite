(function(){
	angular.module('homeCtrl', ['authService', 'userService'])

	.controller('homeController', function($http, $scope, $rootScope, Auth, User){

		var vm = this;

		Auth.login('brian','test');

		vm.loggedIn = Auth.isLoggedIn();

		if(vm.loggedIn){
			Auth.getUser().then(function(res){
				vm.me = res.data;
			});		
		}

		console.log(vm.me);

	});
})();
