function LoginCtrl($scope, user) {
	LOGIN = $scope;
	$scope.username = 'a';
	$scope.password = 'a';

	$scope.clear = function() {
		$scope.error = '';
		$scope.message = '';
	}

	$scope.select = function(character) {
		$scope.selected = character;
	};

	$scope.login = function()	{
		user.login($scope.username, $scope.password).then(function(data) {
			$scope.clear();
			if(data.error) {
				$scope.error = data.error;
			} else {
				$scope.getCharacters();
				$scope.$parent.authenticated = true;
			}
		});
	};

	$scope.getCharacters = function() {
		user.characters().then(function(characters) {
			$scope.characters = characters;
			$scope.freeSlots = characters.length < 4 ? new Array(4 - characters.length):[];
		});
	};

	$scope.register = function() {
		user.register($scope.username, $scope.password).then(function(data) {
			$scope.clear();
			if(data.error) {
				$scope.error = data.error;
			} else {
				$scope.message = 'Account created!';
				$scope.login();
			}
		});
	}

	$scope.create = function() {
		$scope.creatingCharacter = true;
	};

	$scope.enterWorld = function() {
		console.log('choose');
		// todo: move to service?
		user.selectCharacter($scope.selected).then(function() {
			//todo: handle error
			window.location.href = '/game';
		});
		$scope.$parent.loggedIn = true;
	};
}