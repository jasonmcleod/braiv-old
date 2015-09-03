function InventoryCtrl($scope, inventory) {
	INV = $scope;

	$scope.fetch = function() {
		inventory.fetch().then(function(data) {
			$scope.inventory = data;
		});
	}();

	$scope.identify = function(item) {
		inventory.identify(item);
	};

	inventory.on('change', function(data) {
		$scope.inventory = data;
	});
}