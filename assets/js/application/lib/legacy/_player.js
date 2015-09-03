game.player = {
    stats:{},
    stunned:false,
    dead:false,
    criminal:false,
    attackMode:false,
    target:false,
    targetType:false,
    targetProtection:true,
    toggleTargetProtection:function() {
        if(game.playerData.targetProtection) {
            game.playerData.targetProtection = false;
            game.ui.addLog('Target protection <span class="disabled">disabled</span>', 'white', LOG_GENERAL)
        } else {
            game.playerData.targetProtection = true;
            game.ui.addLog('Target protection <span class="enabled">enabled</span>', 'white', LOG_GENERAL)
        }
    },
    toggleAttackMode:function() {
        if(game.playerData.attackMode) {
            game.playerData.attackMode = false;
            game.render.cursor();
            $('#player-hp .meter').addClass('green').removeClass('red')
            $('#target').hide();
            game.playerData.target = 0;
            game.socket.emit("nulltarget",{target: 0})
        } else {
            game.playerData.attackMode = true;
            game.render.cursor();
            $('#player-hp .meter').addClass('red').removeClass('green')
        }
    },
    setTarget:function(type, id) {
        if(typeof type== 'undefined') $('#target').hide();
        game.playerData.target = id;
        game.playerData.targetType = type;
    },
    died:function(x, y) {
        game.players[game.me].x = x
        game.players[game.me].y = y
        $('#target').hide();
        game.playerData.target = 0;
        game.playerData.targetType = 0;
        game.render.minimap();
    },
    levelUp:function(level, attributePoints) {
        console.log('level up!!')
        console.log(arguments)
        game.playerData.level = level
        game.playerData.attributePoints = attributePoints
        game.ui.addLog('You are now level ' + level + '! You have ' + attributePoints + ' attribute points remaining', '#0F0',LOG_GENERAL)
    },
    handleInitialData:function(data) {
        console.log(data)
        for(var field in data) {
            game.playerData[field] = data[field]
        }
        game.me = data.id;
        game.render.vitals();
        game.connected = true;
        if(data.gm==1) {
            $('#debug').show();
        }
        game.assets.ready();
    },
    handlePlayerData:function(data) {
        console.log(data)
        for(var field in data) {
            game.playerData[field] = data[field]
        }
    },
    mount:function() {
        for(var i in game.inventory) {
            if(game.inventory[i].item == ITEM_MOUNT) {
                game.socket.emit('inventory_use', {item:i})
                return;
            }
        }
    },
    location:function(p,x,y) {
        game.players[p].x = x;
        game.players[p].y = y;
    },
    checkMovement:function(key) {
        var key = key || null;
        if(typeof game.players[game.me] == "undefined" || !game.connected || game.playerData.stunned) { return false; }
        var moved = false;
        var wasd = false;
        var requestX = game.players[game.me].x;
        var requestY = game.players[game.me].y;
        var x = 0;
        var y = 0;

        // arrow keys
        if(input.keyboard[38] || key == 38) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y-1)) { requestY = game.players[game.me].y-1; y =-1; moved = "up"; } }; // up
        if(input.keyboard[40] || key == 40) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y+1)) { requestY = game.players[game.me].y+1; y = 1; moved = "down"; } }; // down
        if(input.keyboard[37] || key == 37) { if(game.tileWalkable(game.players[game.me].x-1,game.players[game.me].y)) { requestX = game.players[game.me].x-1; x =-1; moved = "left"; } }; // left
        if(input.keyboard[39] || key == 39) { if(game.tileWalkable(game.players[game.me].x+1,game.players[game.me].y)) { requestX = game.players[game.me].x+1; x = 1; moved = "right"; } }; // right
        // wasd
        if(input.keyboard[87] || key == 87) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y-1)) { requestY = game.players[game.me].y-1; y =-1; moved = "up"; wasd = true;} };
        if(input.keyboard[83] || key == 83) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y+1)) { requestY = game.players[game.me].y+1; y = 1; moved = "down"; wasd = true;} };
        if(input.keyboard[65] || key == 65) { if(game.tileWalkable(game.players[game.me].x-1,game.players[game.me].y)) { requestX = game.players[game.me].x-1; x =-1; moved = "left"; wasd = true;} };
        if(input.keyboard[68] || key == 68) { if(game.tileWalkable(game.players[game.me].x+1,game.players[game.me].y)) { requestX = game.players[game.me].x+1; x = 1; moved = "right"; wasd = true;} };

        // touch inputs
        if(input.touch) {
            if(input.touchX<game.camera.w*game.sprites.w/3) {                                       moved = true; requestX = game.players[game.me].x-1; x=-1; }
            if(input.touchX>game.camera.w*game.sprites.w/3 + game.camera.w * game.sprites.w/3) {    moved = true; requestX = game.players[game.me].x+1; x=1; }
            if(input.touchY<game.camera.h*game.sprites.h/3) {                                       moved = true; requestY = game.players[game.me].y-1; y=-1; }
            if(input.touchY>game.camera.h*game.sprites.h/3 + game.camera.h * game.sprites.h/3) {    moved = true; requestY = game.players[game.me].y+1; y=1; }
        }

        if(moved) {
            game.ui.tapMovementBlock = true;
            game.ui.bank.close();
            game.ui.closeShop();
            game.ui.closeContainer();
            if($(".ui-draggable-dragging").length==0) {
                if((wasd&&$("input:focus").length==0) || !wasd) { // arrow keys, or wasd (without being focused on the input field)
                    //game.socket.emit("putme",{x:requestX,y:requestY,input:true})
                    game.socket.emit("moveby",{x:x, y:y, input:true})
                }
            }
        }
    },
    move:function(player, x, y) {
        game.players[player].x = x;
        game.players[player].y = y;
        if(player == game.me) {
            game.camera.x = x - Math.round((game.camera.w-1)/2);
            game.camera.y = y - Math.round((game.camera.h-1)/2);
            game.render.minimap();
        }
    },
    nameColor:function(player) {
        var red = game.players[player].status <= 0 ? (game.players[player].status*-1) + 155 : 0
        var green = game.players[player].status > 0 ? game.players[player].status + 155 : 0;
        var color = 'rgb(' + red + ', ' + green + ',0)'
        color = game.players[player].gm == 1 ? '#00c6ff' : color
        color = game.players[player].status > -10 && game.players[player].status < 10 ? 'orange' : color
        color = game.players[player].criminal ? 'grey' : color

        return color
    },
    setSpeed:function(speed) {
        clearInterval(game.intervals.movement.loop);
        game.intervals.movement.loop = setInterval(game.player.checkMovement,speed);
    },
    forceRedraw:function(data) {

        for(var field in data) {
            if(data.player == game.me) {
                game.playerData[field] = data[field];
            }
            game.players[data.player][field] = data[field];
        }
        if(data.player == game.me) {
            if(data.hasOwnProperty('sprite')) {
                $('#viewport-me').css({backgroundImage:'url(' + game.paths.players + data.sprite + '.gif)'})
            }
        } else {
            $('.player[index="' + data.player + '"]').remove();
            game.render.players();
        }
    }
}//EOF