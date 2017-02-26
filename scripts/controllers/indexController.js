app.controller('indexController', ['$scope','$timeout', function($scope, $timeout){
	var vm = this;
	vm.name = 'Rishabh';
	vm.getTooltip = function(){
		return 'My name is a \ngood boy';
	}
}]);