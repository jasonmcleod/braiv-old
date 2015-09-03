app.directive('container', ['$compile', 'inventory', function($compile, inventory) {

    var worldDropTile = function(x,y) {
        var container = $('#container').offset();

        var tx = (~~((x - container.left + 12) / spriteWidth)); // 12 is the width of the outer left border of the viewport
        var ty = (~~((y - container.top - 44) / spriteHeight)); // 44 is the height of the top bar

        var cw = ~~(cameraWidth/2);
        var ch = ~~(cameraHeight/2);
        return {
            x:tx==cw ? 0 : tx < cw ? -1 : 1,
            y:ty==ch ? 0 : ty < ch ? -1 : 1,
        };
    };

    var containerDropTile = function(x, y) {
        var slotX = ~~(x / 32);
        var slotY = Math.min(~~(y / 32),3);
        return slotX + (slotY * 6);
    };

    return {
        scope:{
            container:'@container'
        },
        link:function($scope, $element) {
            $($element).droppable({
                greedy:true,
                accept:'.transferable',
                drop:function(e, ui) {
                    var destination = $scope.container;
                    var source = $(ui.draggable).parents('[container]').attr('container');
                    var id = $(ui.draggable).attr('item');

                    console.log(source, destination);
                    if(destination == 'world') {
                        var tile = worldDropTile(ui.offset.left, ui.offset.top);
                        if(source == 'inventory') {
                            if(tile.x == 0 && tile.y == 0) {
                                inventory.refresh();
                            } else {
                                console.log('drop');
                                socket.get('/inventory/drop', {item:id, x:tile.x, y:tile.y});
                            }
                            $(ui.draggable).removeClass('transferable');
                        } else if(source == 'world') {
                            if(tile.x == 0 && tile.y == 0) {
                                socket.get('/map/collect', {item:id});
                            } else {
                                socket.get('/map/moveItem', {item:id, x:tile.x, y:tile.y});
                            }
                        }
                    } else if(destination == 'inventory') {
                        var pane = $(this);
                        var panePosition = pane.position();
                        if(source == 'world') {
                            var dropX = ui.position.left - panePosition.left;
                            var dropY = ui.position.top - panePosition.top + 10;
                            var slot = containerDropTile(dropX, dropY);
                            socket.get('/map/collect', {item:id, slot:slot})
                            $(ui.draggable).removeClass('transferable');
                        } else if(source == 'inventory') {
                            var dropX = ui.position.left;
                            var dropY = ui.position.top + 10;
                            var slot = containerDropTile(dropX, dropY);
                            socket.get('/inventory/move', {item:id, slot:slot}, function(status) {
                                inventory.refresh();
                            });
                            $(ui.draggable).removeClass('transferable');
                        }
                    }
                }
            });
        }
    };
}]);

