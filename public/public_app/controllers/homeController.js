(function(){
	angular.module('homeCtrl', ['authService', 'userService'])

	.controller('homeController', function($http, $scope, $rootScope, Auth, User){

		var vm = this;


		//-------------------------------Function Calls
		checkedLoggedInStatus();
		getUser();


		//-------------------------------Private Functions

		function checkedLoggedInStatus(){
			vm.loggedIn = Auth.isLoggedIn();
		}

		function getUser(){			
			if(vm.loggedIn){
				Auth.getUser().then(function(res){
					console.log(res);
					vm.user = res.data.user;
				});		
			}
		}

	});
})();
