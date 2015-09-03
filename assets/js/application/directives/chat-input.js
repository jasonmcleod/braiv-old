app.directive('chatInput', ['$compile', function($compile) {
    return {
        link:function($scope, $element) {

        	$scope.$watch('showChatInput', function(n, o) {
                if(!n) return;
                if(n) {
                    setTimeout(function() {
                        $($element).focus();
                        console.log('focus')
                    },1);
                }
                console.log(n, o);
            });
        }
    };
}]);