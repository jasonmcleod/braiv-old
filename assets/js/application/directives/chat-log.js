app.directive('chatLog', ['$compile', function($compile) {
    return {
        link:function($scope, $element) {
        	$scope.$on('scroll-chat', function() {
                setTimeout(function() {
                    $($element).scrollTop(999999);
                },100);
            });
        }
    };
}]);