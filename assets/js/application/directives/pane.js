app.directive('pane', ['$compile', function($compile) {
    return {
        link:function($scope, $element) {

        	// todo: stack order can get weird...

        	var moveToTop = function() {
        		$('[pane]').not($element).css({zIndex:249});
        		$element.css({zIndex:251});
        	};

			$($element).draggable({
        		snap:'.box:visible, #topbar, #viewport, #container',
        		handle:'.title',
        		zIndex:250,
        		start:function() {
        			moveToTop();
        		}
    		}).click(function() {
    			moveToTop();
    		});
        }
    };
}]);