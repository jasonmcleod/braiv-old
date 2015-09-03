function GameCtrl($scope, $rootScope, game, user, assets, input, chat, inventory) {
	GAME = $scope;

	$scope.showMap = false;
	$scope.showCharacter = false;
	$scope.showInventory = false;
	$scope.showChat = true;
	$scope.showChatInput = false
	$scope.showBank = false;
	$scope.showShop = false;
	$scope.showDropArea = false;
	$scope.chatLog = [];
	$scope.showEditors = admin;

	$scope.chatType = 'global';
	$scope.camera = {};

	$scope.chatHandler = chat.handler(function(log) {
		$scope.chatLog = log;
	});

	key('enter', function() {
		$scope.$apply(function() {
			$scope.showChatInput = true;
		});
	});

	$scope.sendChat = function() {
		if($scope.chatText>'') chat.send($scope.chatText, $scope.chatType);
		$scope.chatText = '';
		$scope.showChatInput = false;
	};

	assets.fetchAll().then(function() {
		// $scope.world_items = assets.world_items;
		$scope.items = assets.items;
		manager.items = assets.items;

		game.connect({
			onWorldItemsChanged:function(data) {
				$scope.$apply(function() {
					$scope.world_items = data;
				});
				// console.log('in controller!', data);
			}
		},function(player) {
			$scope.player = player;
			manager.playerData = player;
			setInterval(function() {
				input.movement(function(x,y) {
					// todo: this is probably not efficiant at all...
					$scope.$apply(function() {
						// $scope.playerInfo.x = x;
						// $scope.playerInfo.y = y;
						$scope.camera.x = x - 23/2;
						$scope.camera.y = y - 17/2;
					});
				});
			},200);
		});
	});
	


}