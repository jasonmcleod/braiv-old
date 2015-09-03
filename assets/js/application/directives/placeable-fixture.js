app.directive('placeableFixture', ['$compile', function($compile) {
    return {
    	scope:{
    		fixture:'=placeableFixture',
    		index:'=',
            key:'=key'
    	},
        link:function($scope, $element) {
        	console.log('derp', $scope.index, $scope.fixture, $scope.key);
        	var x = $scope.index * 32;
        	var y = ~~($scope.index / 6) * 32;
        	$element.css({
        		'background-image':'url(/fixtures.png)',
        		'background-position':'0 ' + ($scope.index * -32) + 'px',
        		left:x + 2,
        		top:y + 22
        	}).draggable();

        	$('#viewport').droppable({
        		accept:'[placeable-fixture]',
        		drop:function(e, ui) {
        			var pane = $(this);
                    var panePosition = pane.position();

        			var dropX = ~~((ui.offset.left - $('#viewport').position().left) / 32);
                    var dropY = ~~((ui.offset.top - $('#viewport').position().top - 40) / 32);
                    var actualX = manager.players[manager.me].x + dropX - ~~(cameraWidth / 2);
                    var actualY = manager.players[manager.me].y + dropY - ~~(cameraHeight / 2);
                    socket.post('/fixture/place', {fixture:$scope.key, x:actualX, y:actualY});
					console.log(actualX, actualY)
        		}
        	});
        }
    };
}]);