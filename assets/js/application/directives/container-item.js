app.directive('containerItem', ['$compile', function($compile) {
    return {
        scope:{
            item:'=containerItem'
        },
        link:function($scope, $element) {
            //todo: handle identify code;
            $element.css({
                top:$scope.item.top(),
                left:$scope.item.left(),
                'background-image':'url(' + $scope.item.sprite() + ')'
            }).draggable({
                zIndex:1000,
                cursorAt:{left:16, top:16},
                start:function(e,ui) {

                },
                stop:function(e, ui) {

                }
            }).addClass('transferable');
        }
    };
}]);