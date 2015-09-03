game.render = {
    viewport:function() {
        game.render.floodfill();
        game.render.items();
        game.render.npcs();
        game.render.players();
        game.render.target();
        game.render.minimap();

        game.dom.ctx.drawImage(game.dom.buffer_element,0,0);
    },
    animations:function() {
        game.animationFrame = game.animationFrame < 3 ? game.animationFrame + 1 : 0;
    },
    cursor:function() {
        if(game.playerData.attackMode) {
            $('html, body').removeClass('normal').addClass('combat').css({cursor:'url(../resources/cursors/combat.cur), auto !important'})
        } else {
            $('html, body').removeClass('combat').addClass('normal').css({cursor:'url(../resources/cursors/normal.cur), auto !important'})
        }
    },
    fog:[],
    floodstack:0,
    floodchunk:[],
    floodfill:function() {
        game.dom.buffer.fillStyle = "rgba(0,0,0,1)";
        game.dom.buffer.fillRect(0, 0, game.camera.w * game.sprites.w, game.camera.h * game.sprites.h)
        game.camera.x = game.players[game.me].x - Math.floor((game.camera.w)/2);
        game.camera.y = game.players[game.me].y - Math.floor((game.camera.h)/2);

        // blank out the chunk
        game.render.floodchunk = [];
        game.render.floodstack = 0;

        for(var x=0; x<game.camera.w+1; x++) {

            // create some blank arrays
            game.render.floodchunk[x] = [];
            game.render.fog[x] = [];

            for(var y=0; y<game.camera.h+1; y++) {

                // assume its not visible
                game.render.fog[x][y] = true;

                var mapX = game.camera.x+x > -1 ? game.camera.x+x : 0;
                var mapY = game.camera.y+y > -1 ? game.camera.y+y : 0;

                // does this terrain tile block the view?
                game.render.floodchunk[x][y] = game.maptiles[game.map[mapY * 1000 + mapX]].block_view;

                // does this fixture tile block the view?
                if(game.fixtureMap[mapX][mapY]) {
                    game.render.floodchunk[x][y] = 1;
                }
            }
        }

        // always draw the center tile, this ensures they see at least the tiles
        // that they are standing next to, also sets up the forest so they are tougher to walk through
        game.render.floodchunk[Math.floor(game.camera.w/2)][Math.floor(game.camera.h/2)] = 0;
        var mapX = game.camera.x+x > Math.floor(game.camera.w/2) ? game.camera.x+Math.floor(game.camera.w/2) : 0;
        var mapY = game.camera.y+y > Math.floor(game.camera.h/2) ? game.camera.y+Math.floor(game.camera.h/2) : 0;
        var tile = game.maptiles[game.map[mapY * 1000 + mapX]].scaled;
        try {
            game.dom.buffer.drawImage(tile,Math.floor(game.camera.w/2)*game.sprites.w,Math.floor(game.camera.h/2)*game.sprites.h,game.sprites.w,game.sprites.h);
        } catch(err) {
            console.log(tile)
        }

        game.render.flood(Math.floor(game.camera.w/2),Math.floor(game.camera.h/2));

    },
    flood:function(x,y) {

        var checkX = game.camera.x+x > 0 ? game.camera.x+x:0;
        var checkY = game.camera.y+y > 0 ? game.camera.y+y:0;

        if(x > -1 && x <= game.camera.w && y > -1 && y <= game.camera.h) {

            if(game.render.floodchunk[x][y] != 1) {
                // stack cursor.. tracks how many layers deep in the recursive call we are
                game.render.floodstack++;

                // what tile is here?
                var tile = game.maptiles[game.map[checkY * 1000 + checkX]].img;

                // tiles 20-27 are the edges of land/water - clear them out first
                if(game.map[checkX][checkY] == 1 || (game.map[checkX][checkY]>=20 && game.map[checkX][checkY]<=27)) {
                    //game.dom.buffer.drawRect()
                    game.dom.buffer.clearRect(x * game.sprites.w, y * game.sprites.h, game.sprites.w, game.sprites.h);
                    game.dom.ctx.clearRect(x * game.sprites.w, y * game.sprites.h, game.sprites.w, game.sprites.h);
                }

                //
                game.render.floodchunk[x][y] = 1;

                // + | see if we can draw up, down, left, and right
                game.render.flood(x+1,y);
                game.render.flood(x,y+1);
                game.render.flood(x-1,y);
                game.render.flood(x,y-1);

                // \ | see if we can draw down-right, and up-left diagonally
                game.render.flood(x-1,y-1);
                game.render.flood(x+1,y+1);

                // / | see if we can draw down-left, and up-right diagonally
                game.render.flood(x+1,y-1);
                game.render.flood(x-1,y+1);

                // this pass is done, remove it from the stack cursor
                game.render.floodstack--;

                // if everything has been drawn, or fogged out, render what fixtures we can see
                if(game.render.floodstack==0) {
                    game.render.fixtures();
//                    game.render.shadows();
                }


                //game.dom.buffer.drawImage(game.dom.blackblur, x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
            } else {
                var checkX = game.camera.x+x > -1 ? game.camera.x+x:0;
                var checkY = game.camera.y+y > -1 ? game.camera.y+y:0;
                var tile = game.maptiles[game.map[checkY * 1000 + checkX]].scaled;

                if(x>-1 && x < game.camera.w && y>-1 && y < game.camera.h) {
                    // we can draw here, so clear the fog so the fixture will be visible
                    game.render.fog[x][y] = false;
                }

                try {
                game.dom.buffer.drawImage(tile,x*game.sprites.w,y*game.sprites.h);
                } catch(err) {

                }




            }

        }

    },
    shadows:function() {
//        var x = ((game.world_fixtures[fixture].x-game.camera.x)*game.sprites.w);
//        var y = ((game.world_fixtures[fixture].y-game.camera.y)*game.sprites.h);
        for(cx=0;cx<game.camera.w;cx++) {
            for(cy=0;cy<game.camera.h;cy++) {
                if(game.render.fog[cx][cy]) {
                    game.dom.buffer.drawImage(game.dom.blackblur,cx*game.sprites.w - game.sprites.w/2,cy*game.sprites.h - game.sprites.h/2)
                }
            }
        }
    },
    fixtures:function() {
        for(var fixture in game.world_fixtures) {
            var x = ((game.world_fixtures[fixture].x-game.camera.x)*game.sprites.w);
            var y = ((game.world_fixtures[fixture].y-game.camera.y)*game.sprites.h);
            var cx = x / game.sprites.w;
            var cy = y / game.sprites.h;
//            console.log(cx + ' ' + cy)
            if(cx>-1&& cy>-1 && cx<game.camera.w && cy<game.camera.h) {
                // if theres no fog on this tile, draw the fixture since we can see it
                if(!game.render.fog[cx][cy]) {
                    var frame = game.fixtures[game.world_fixtures[fixture].fixture].animationType == "random" ? Math.floor(Math.random()*4) : 0
                    game.dom.buffer.drawImage(game.fixtures[game.world_fixtures[fixture].fixture].scaled, frame * game.sprites.w, 0, game.sprites.w, game.sprites.h, x, y,32,32)
                }
            }
        }
    },
    minimap:function() {
        $("#minimap .crop").css({backgroundPosition: ((game.camera.x*-1)+62) + 'px ' + ((game.camera.y*-1)+45) + 'px'})
    },
    players:function() {
        if(typeof game.players != "undefined" && game.me!=0) {
            for(var player in game.players) {
                if(player!=game.me) {

                    var x = ((game.players[player].x - game.camera.x) * game.sprites.w);
                    var y = ((game.players[player].y - game.camera.y) * game.sprites.h);

                    var cx = x / game.sprites.w;
                    var cy = y / game.sprites.h;

                    if((x>-1 && x < game.camera.w*game.sprites.w)  && (y>-1 && y < game.camera.h*game.sprites.h)) {
                        if(!game.render.fog[cx][cy]) {

                            if($("#player_" + game.players[player].id).length!=1) {
                                var playerHTML = "<div style='background:url(" + game.paths.players + game.players[player].sprite + ".gif);' id='player_" + game.players[player].id + "' index='" + game.players[player].id + "' class='sprite player " + (game.players[player].gm == 1 ? 'gm':'') + "'>";
                                    playerHTML+= "<p class='nametag-stroke nametag-l'><span class='nametag-prefix'>" + game.players[player].prefix + "</span>" + game.players[player].name + "</p>"
                                    playerHTML+= "<p class='nametag-stroke nametag-r'><span class='nametag-prefix'>" + game.players[player].prefix + "</span>" + game.players[player].name + "</p>"
                                    playerHTML+= "<p class='nametag-stroke nametag-d'><span class='nametag-prefix'>" + game.players[player].prefix + "</span>" + game.players[player].name + "</p>"
                                    playerHTML+= "<p class='nametag-stroke nametag-u'><span class='nametag-prefix'>" + game.players[player].prefix + "</span>" + game.players[player].name + "</p>"
                                    playerHTML+= "<p class='nametag nametag-main' style='color:" + game.player.nameColor(player) + "'><span class='nametag-prefix prefix'>" + game.players[player].prefix + "</span>" + game.players[player].name + "</p>"
                                    playerHTML+= "&nbsp;</div>"
                                $(game.dom.players).append(playerHTML);
                            }

                            if(game.players[player].criminal) {
                                $("#player_" + game.players[player].id).find('.nametag-main').addClass('criminal')
                            } else {
                                $("#player_" + game.players[player].id).find('.nametag-main').removeClass('criminal')
                            }

                            if($("#player_" + game.players[player].id).is(".targeted")) {
                                render.target();
                            }
                            $("#player_" + game.players[player].id).css({left:x,top:y});
                        } else {
                            $("#player_" + game.players[player].id).remove();
                        }
                    } else {
                        if($("#player_" + game.players[player].id).length>0) {
                            $("#player_" + game.players[player].id).remove();
                        }
                    }
                }
            }
        }
    },
    npcs:function() {
        if (typeof game.world_npcs != 'undefined') {
            for(var npc in game.world_npcs) {
                var x = ((game.world_npcs[npc].x - game.camera.x) * game.sprites.w);
                var y = ((game.world_npcs[npc].y - game.camera.y) * game.sprites.h);
                var cx = x / game.sprites.w;
                var cy = y / game.sprites.h;

                if((x>-1 && x < game.camera.w * game.sprites.w)  && (y > -1 && y < game.camera.h * game.sprites.h)) {
                    if(!game.render.fog[cx][cy]) {

                        if($("#npc_" + game.world_npcs[npc].id).length<1) {
                            $(game.dom.npcs).append("<div index='" + game.world_npcs[npc].id + "' id='npc_" + game.world_npcs[npc].id + "' class='sprite npc " + (game.npcs[game.world_npcs[npc].npc].hostile==1?"hostile":"friendly") + "' style='width:" + ((game.npcs[game.world_npcs[npc].npc].width*game.sprites.w)) + "px; height:" + (game.npcs[game.world_npcs[npc].npc].height*game.sprites.h) + "px; background-image:url(" + game.paths.npcs + game.npcs[game.world_npcs[npc].npc].sprite + ".gif);'></div>");
                            if(game.npcs[game.world_npcs[npc].npc].height>1) {

                                $("#npc_" + game.world_npcs[npc].id).css({marginLeft:-game.sprites.w/2,marginTop:-game.sprites.h/2})
                            }
                            $("#npc_" + game.world_npcs[npc].id).data("frame",Math.round(Math.random()*3));
                        }
                        if($("#npc_" + game.world_npcs[npc].id).is(".targeted")) {
                            render.target();
                        }
                        $("#npc_" + game.world_npcs[npc].id).css({left:x,top:y});
                    } else {
                        if($("#npc_" + game.world_npcs[npc].id).length>0) {
                            $("#npc_" + game.world_npcs[npc].id).remove();
                        }
                    }
                } else {
                    if($("#npc_" + game.world_npcs[npc].id).length>0) {
                        $("#npc_" + game.world_npcs[npc].id).remove();
                    }
                }
            }
        }
        $("#npcs .npc").each(function() {
            //var thisID = $(this).attr("id").split("_")[1];
            if(typeof game.world_npcs[$(this).attr("index")] == "undefined") {
                $(this).remove();
            }
        })
    },
    items:function() {
        var drawnTotal = 0;
        if(typeof game.players == 'undefined' || !game.players[game.me]) return;

        for(gameitem in game.world_items) {
            if(game.world_items[gameitem]) {
                var x = ((game.world_items[gameitem].x - game.camera.x) * game.sprites.w)//+$(elements.viewport).position().left-viewportOffsetX;
                var y = ((game.world_items[gameitem].y - game.camera.y) * game.sprites.h)//+$(elements.container).position().top-viewportOffsetY;

                var cx = x / game.sprites.w;
                var cy = y / game.sprites.h;

                if((x>-1 && x < game.camera.w * game.sprites.w) && (y>-1 && y < game.camera.h * game.sprites.h)) {
                    if(!game.render.fog[cx][cy]) {

                        if((game.world_items[gameitem].x==game.players[game.me].x-1 || game.world_items[gameitem].x==game.players[game.me].x+1 || game.world_items[gameitem].x==game.players[game.me].x) && (game.world_items[gameitem].y==game.players[game.me].y-1 || game.world_items[gameitem].y==game.players[game.me].y+1 || game.world_items[gameitem].y==game.players[game.me].y)) {
                            if($("#gameitem_" + gameitem).length!=1) {
                                $(game.dom.items).append("<img item='" + gameitem + "' id='gameitem_" + gameitem + "' class='sprite " + (game.items[game.world_items[gameitem].item].notMovable==1 ? "not-movable" : "") + " item item-" + game.world_items[gameitem].item + "' src='" + game.paths.items + game.items[game.world_items[gameitem].item].sprite + ".gif'>&nbsp;</div>");
                            }
                            $("#gameitem_" + gameitem + ":not('.ui-draggable-dragging')").css({left:x,top:y}).attr("rel",x+"_"+y);
                        } else {
                            game.dom.buffer.drawImage(game.items[game.world_items[gameitem].item].img, game.animationFrame * game.sprites.w, 0, game.sprites.w, game.sprites.h, x, y, game.sprites.w, game.sprites.h);
                            $("#gameitem_" + gameitem).remove();
                        }
                    } else {
                        $("#gameitem_" + gameitem).remove();
                    }
                } else {
                    $("#gameitem_" + gameitem).remove();
                }
            }
        }
    },
    water:function() {

    },
    inventory:function() {
        for(var i in game.inventory) {
            if(game.inventory[i].equipped!=0) {
                if(!$('#character .equipment[slot="' + game.inventory[i].equipped + '"] .item[item="' + game.inventory[i].id + '"]').length) {
                    $insert = $('<div class="item sprite" itemtype="' + game.inventory[i].item + '" item="' + game.inventory[i].id + '"><div>');
                    $insert.css({background:'url(' + game.paths.items + game.items[game.inventory[i].item].sprite + '.gif)'});
                    $insert.appendTo($('#character .equipment[slot="' + game.inventory[i].equipped + '"]'));
                    $insert.draggable();
                }

                // remove it from inventory
                $('#inventory .item[item="' + game.inventory[i].id + '"]').remove();
            } else {
                var $item = $('#inventory .item[item="' + game.inventory[i].id + '"]')

                if(!$item.length) {
                    $item = $('<div class="item sprite" item="' + game.inventory[i].id + '" itemtype="' + game.inventory[i].item + '"><div>');
                    $item.appendTo($('#inventory'));
                    $item.draggable();
                    if(game.items[game.inventory[i].item].stackable==1) {
                        $item.addClass('stackable')
                    }
                    $item.css({
                        top:game.inventory[i].y,
                        left:game.inventory[i].x,
                        background:'url(' + game.paths.items + game.items[game.inventory[i].item].sprite + '.gif)'
                    })
                }

                // remove it from equipped area
                $('#character .item[item="' + game.inventory[i].id + '"]').remove();
            }
        }
    },
    bank:function(data) {
        game.bank = data;
        for(var i in data) {
            //if(!$('#bank .item[item="' + data[i].id + '"]').length) {
                $insert = $('<div class="item sprite ' + (game.items[data[i].item].stackable==1?'stackable':'') + '" item="' + data[i].id + '" itemtype="' + data[i].item + '"><div>');
                $insert.appendTo($('#bank'));
                $insert.draggable();

                $('#bank .item[item="' + data[i].id + '"]').css({
                    top:data[i].y,
                    left:data[i].x,
                    background:'url(' + game.paths.items + game.items[data[i].item].sprite + '.gif)'
                });
            //}
        }
    },
    vitals:function() {
        if(!game.me || $.isEmptyObject(game.players)) return;

        var levelxp = game.levels[game.playerData.level];
        if(game.playerData.level == game.levels.length) { levelxp = game.levels[game.levels.length - 1]; }

        $('#player-nametag .name').css({color:game.player.nameColor(game.me)}).text(game.playerData.name);
        $('#player-nametag .guild').text(game.playerData.prefix + ' ');

        $('#player-hp .value').html(game.players[game.me].hp + ' / ' + game.players[game.me].maxhp)
        $('#player-hp .meter').css({width: (game.players[game.me].hp / game.players[game.me].maxhp * 98.5) + '%'})

        $('#player-xp .value').html(game.players[game.me].xp + ' / ' + levelxp)

        $('#player-xp .meter').css({width: ((game.levels[game.playerData.level-1] - game.players[game.me].xp) / (game.levels[game.playerData.level-1] - game.levels[game.playerData.level]) * 98.5) + '%'})

        $('#armor-value').text(game.playerData.armor);
        $('#weight-value').text(game.playerData.weight + '/' + game.playerData.maxWeight);

        $('#level-value').text(game.playerData.level);
        $('#str-value').text(game.playerData.str);
        $('#dex-value').text(game.playerData.dex);
        $('#int-value').text(game.playerData['int']);
        $('#con-value').text(game.playerData.con);

        if(game.playerData.attributePoints>0) {
            $('.attributeOrb').show();
        } else {
            $('.attributeOrb').hide();
        }

        if(game.playerData.gm==1) {
            $('#debug #mapPosition').text('Player position: ' + game.players[game.me].x + ', ' + game.players[game.me].y)
        }

    },
    damage:function(data) {
        if(data.attacker==game.me) {
            var combatLogName = data.targetType==TYPE_NPC ? game.npcs[game.world_npcs[data.target].npc].name : game.players[data.target].name;
            var combatLogColor= '#1cb800';

            if(data.targetType==TYPE_NPC) {
                if($("#npc_" + data.target).length>0) {
                    var thisTarget = $("#npc_" + data.target).position();
                }
            }
            if(data.targetType==TYPE_PLAYER) {
                if($("#player_" + data.target).length>0) {
                    var thisTarget = $("#player_" + data.target).position();
                }
            }
        } else {
            var combatLogName = 'asd';//data.attackerType==TYPE_NPC ? game.npcs[game.world_npcs[data.attacker].npc].name : game.players[data.attacker].name;
            var combatLogColor= 'red';
        }

        // add to combat log if player is being attacked, or player is attacking
        if(data.attacker == game.me || data.target == game.me) {
            // prevent values from falling out of combat log
            if($('#combatlog ul li').length == 10) {
                $('#combatlog ul li:first').remove();
            }

            // add value to combat log
            $('#combatlog ul').append('<li style="color:' + combatLogColor + '">' + combatLogName + ': ' + data.damage + '</li>')

        }


        if("ranged" in data && data.ranged) {
            var projectile = {id:(new Date()).getTime()}

            if(data.attacker == game.me && data.attackerType == TYPE_PLAYER) {
                projectile.x1 = game.camera.w*game.sprites.w / 2 - game.sprites.w / 2;
                projectile.y1 = game.camera.h*game.sprites.h / 2 - game.sprites.h / 2;
            } else {
                projectile.x1 = (game.players[data.attacker].x - game.camera.x) * game.sprites.w
                projectile.y1 = (game.players[data.attacker].y - game.camera.y) * game.sprites.h
            }

            if(data.targetType == TYPE_NPC) {
                projectile.x2 = (game.world_npcs[data.target].x - game.camera.x) * game.sprites.w
                projectile.y2 = (game.world_npcs[data.target].y - game.camera.y) * game.sprites.h
            }

            if(data.targetType == TYPE_PLAYER) {
                if(data.target == game.me) { // if im the target send it to the center of my screen
                    projectile.x2 = game.camera.w * game.sprites.w / 2 - game.sprites.w / 2;
                    projectile.y2 = game.camera.h * game.sprites.h / 2 - game.sprites.h / 2;
                } else {
                    projectile.x2 = (game.players[data.target].x - game.camera.x) * game.sprites.w
                    projectile.y2 = (game.players[data.target].y - game.camera.y) * game.sprites.h
                }
            }

            $("#viewport-projectiles").append("<img id='projectile_" + projectile.id + "' class='sprite projectile' src='" + game.paths.items + game.items[data.ranged].projectileSprite + ".gif'>");
            projectile.rotate = Math.atan2(projectile.y2 - projectile.y1, projectile.x2 - projectile.x1) / Math.PI * 180 - 90;

            $("#projectile_" + projectile.id).css({
                top:projectile.y1,
                left:projectile.x1,
                "-webkit-transform":"rotate(" + projectile.rotate + "deg)"
            }).animate({
                top:projectile.y2,
                left:projectile.x2
            },function() {
                $(this).remove();
            });

            if(data.attacker == game.me && data.attackerType == TYPE_PLAYER) {
                game.render.floatingText(data.damage, projectile.x2, projectile.y2, data.crit ? 'white' : '#1cb800', data.crit ? 30 : 15)
            }

        } else {
            if(data.attacker==game.me) {
                if(data.targetType==TYPE_NPC) {
                    if($("#npc_" + data.target).length>0) {
                        textPlacementY = $("#npc_" + data.target).position().top;
                        textPlacementX= $("#npc_" + data.target).position().left;
                        game.render.floatingText(data.damage, textPlacementX, textPlacementY, data.crit ? 'white' : '#1cb800', data.crit ? 30 : 15)
                    }
                }
            }
        }
        setTimeout(function(target, type) {
            if(parseInt(data.attacker)==game.me) {
                if(data.targetType==TYPE_NPC) {
                    if(data.hasOwnProperty("xp")) {
                        game.playerData.stats.xp = data.xp;
                    }
                };
            };

            if(target==game.me) {
                $elm = $("#viewport-me");
            } else {
                if(type==TYPE_NPC) { $elm = $("#npc_" + target); }
                if(type==TYPE_PLAYER) { $elm = $("#player_" + target); }
            }
            var damageX = 0;
            var damageY = 0;
            if(type==TYPE_NPC && typeof game.world_npcs[target] !="undefined" ) {
                damageX = game.world_npcs[target].x-game.camera.x
                damageY = game.world_npcs[target].y-game.camera.y
            }
            if(type==TYPE_PLAYER && typeof game.players[target] !="undefined") {
                damageX = game.players[target].x-game.camera.x
                damageY = game.players[target].y-game.camera.y
            }
            $elm.append("<div class='sprite damage'></div>")
            setTimeout(function() {
                $(".damage").remove()
            },300)

        },("delay" in data ? data.delay : 0),data.target,data.targetType)
    },
    missed:function(data) {
        if(parseInt(data.target)==game.me) {
            $elm = $("#viewport-me");
        } else {
            if(data.targetType==TYPE_NPC) { $elm = $("#npc_" + data.target); }
            if(data.targetType==TYPE_PLAYER) { $elm = $("#player_" + data.target); }
        }
        $elm.append("<div class='sprite missed'></div>")
        setTimeout(function() {
            $(".missed").remove()
        },300)
    },
    target:function() {
        if(!game.playerData.target || game.playerData.target==0) return false;

        var target = game.playerData.targetType == TYPE_NPC ? game.world_npcs[game.playerData.target] : game.players[game.playerData.target]
        var exists = $('#' + (game.playerData.targetType == TYPE_NPC ? 'npc_' : 'player_') + game.playerData.target);

        if(exists && typeof target == 'undefined') {
            exists.remove();
            if($('#target:visible').length) $('#target').hide();
        } else {

            if(exists.length>0) {
                $('#target').css({
                    top:(target.y - game.camera.y) * game.sprites.h,
                    left:(target.x - game.camera.x) * game.sprites.w
                }).show();
                $("#target .meter .value").css({
                    width:(target.hp / target.maxhp * 100) + '%'
                })
            } else {
                if($('#target:visible').length) $('#target').hide();
            }
        }

    },
    floatingText:function(text, x, y, color, size) {
        var thisFT = (new Date()).getTime();
        $("#viewport").prepend("<p id='ft_" + thisFT + "' class='floatingText'>" + text + "</p>");

        $("#ft_" + thisFT).css({
            top:y,
            left:x,
            color:color
        }).animate({
            fontSize:size,
            top:y - size * 3
        },{
            duration:500,
            easing:"easeOutElastic",
            complete:function() {
                $("#ft_" + thisFT).animate({
                    top:y - game.sprites.h * 2 - 100,
                    opacity:.25
                },
                {duration:1000,
                    easing:"easeOutQuad",
                    complete:function() {
                        $(this).remove();
                    }
                })
            }
        }).mouseover(function() {
            $(this).remove();
        })
    }
}//EOF