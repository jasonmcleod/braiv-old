function NewCharacterCtrl($scope, user) {

	$scope.cancel = function() {
		$scope.$parent.creatingCharacter = false;
	};

	$scope.create = function() {
		console.log('create!');
		user.createCharacter({
			name:$scope.name,
			str:$scope.str,
			dex:$scope.dex,
			int:$scope.int,
			con:$scope.con,
		}).then(function(result) {
			if(result.err) {
				console.log(result.err);
			} else {
				$scope.$parent.selected = result.id;
				$scope.$parent.getCharacters();
				$scope.$parent.creatingCharacter = false;
			}
		});
	};

	$scope.name = 'Jeezle';

	$scope.pool = 0;

	// defaults
	$scope.str = 5;
	$scope.dex = 5;
	$scope.int = 5;
	$scope.con = 5;

	$scope.adjustStat = function(stat, dir) {
		// check pool if going up
		if(dir>0 && $scope.pool<=0) return false;

		// apply change
		$scope[stat]+=dir;

		// prevent 0
		if($scope[stat]<0) $scope[stat] = 0;

		// recalculate pool
		$scope.pool = 20 - $scope.str - $scope.dex - $scope.int - $scope.con;
	};
}