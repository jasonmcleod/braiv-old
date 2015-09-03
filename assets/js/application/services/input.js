app.service('input', [function () {

    var service = {
        movement:function(onMove) {
            var key = key || null;
            if(typeof manager.players == 'undefined' || typeof manager.players[manager.me] == "undefined" || !connected || manager.playerData.stunned) { return false; }
            var moved = false;
            var wasd = false;
            var requestX = manager.players[manager.me].x;
            var requestY = manager.players[manager.me].y;
            var x = 0;
            var y = 0;

            // arrow keys
            // todo: canWalkOnTile should be in a map sevivce?
            if(input.keyboard[38] || key == 38) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; } }; // up
            if(input.keyboard[40] || key == 40) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; } }; // down
            if(input.keyboard[37] || key == 37) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; } }; // left
            if(input.keyboard[39] || key == 39) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; } }; // right
            // wasd
            if(input.keyboard[87] || key == 87) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; wasd = true;} };
            if(input.keyboard[83] || key == 83) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; wasd = true;} };
            if(input.keyboard[65] || key == 65) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; wasd = true;} };
            if(input.keyboard[68] || key == 68) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; wasd = true;} };


            if(moved) {
                // todo: make bank service
                bank.close();
                // todo: make shop service
                shop.close();
                // todo: make container service
                container.close();
                // todo: move into directive?
                if($(".ui-draggable-dragging").length==0) {
                    //if((wasd && $("input:focus").length==0) || !wasd) { // arrow keys, or wasd (without being focused on the input field)
                    if($("input:focus").length==0) { // arrow keys, or wasd (without being focused on the input field)
                        socket.get('/character/moveBy',{x:x, y:y, input:true},function(data) {
                            onMove(data.x, data.y);
                        });
                        // socket.emit("moveby",{x:x, y:y, input:true})
                        // console.log('move me!!')
                    }
                }
            }
        }
    }
    return service;
}]);