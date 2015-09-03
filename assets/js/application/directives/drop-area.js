app.directive('dropArea', ['$compile', function($compile) {
    return {
        link:function($scope, $element) {
        	$($element).droppable(function(e, ui) {
                console.log('dropped');
            });
        }
    };
}]);