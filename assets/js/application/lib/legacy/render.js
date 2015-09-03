var render = {
    floodMap:[],
    floodStack:0,
    floodSetup:function() {

        if(!manager.me || !manager.players[manager.me]) {
            return false;
        }
        cameraX = manager.players[manager.me].x - Math.floor((cameraWidth)/2);
        cameraY = manager.players[manager.me].y - Math.floor((cameraHeight)/2);

        terrainBufferCTX.fillStyle='rgb(0,0,0)';
        terrainBufferCTX.fillRect(0,0,cameraWidth * spriteWidth, cameraHeight * spriteHeight);

        for(var x=0;x<cameraWidth+1; x++) {
            render.floodMap[x] = [];
            for(var y=0;y<cameraHeight+1; y++) {
                render.floodMap[x][y] = 0;
            }
        }

        render.floodFill(~~(cameraWidth/2), ~~(cameraHeight/2))
    },
    floodTouching:function(x,y) {
        return (
            render.floodMap[x][y]==1
            // right
            || (x<cameraWidth && render.floodMap[x+1][y])
            // left
            || (x>0 && render.floodMap[x-1][y])
            // up
            || (y>0 && render.floodMap[x][y-1])
            // down
            || (y<cameraHeight && render.floodMap[x][y+1])
            // down/right
            || (x<cameraWidth && y<cameraHeight && render.floodMap[x+1][y+1])
            // up/right
            || (x<cameraWidth && y>0 && render.floodMap[x+1][y-1])
            // up/left
            || (x>0 && y<cameraHeight && render.floodMap[x-1][y+1])
            // up/left
            || (x>0 && y>0 && render.floodMap[x-1][y-1])
            // fixture
            || _.find(manager.world_fixtures,{x:x, y:y})
            // touching player
            || ((x==cameraCenterX-1 || x==cameraCenterX+1 || x==cameraCenterX) && (y==cameraCenterY-1 || y==cameraCenterY+1 || y==cameraCenterY))
        )
    },
    floodFill:function(x,y) {
        var mx = cameraX + x;
        var my = cameraY + y;

        if(render.floodMap[x][y]==0) {
            render.floodStack++;
            render.floodMap[x][y] = -1;
            if(x>0 && !manager.blocksView(mx-1, my)) {
                render.floodFill(x-1,y)
                render.floodMap[x-1][y] = 1;
            }
            if(x < cameraWidth && !manager.blocksView(mx+1, my)) {
                render.floodFill(x+1,y)
                render.floodMap[x+1][y] = 1;
            }
            if(y>0 && !manager.blocksView(mx, my-1)) {
                render.floodFill(x,y-1)
                render.floodMap[x][y-1] = 1;
            }
            if(y < cameraHeight && !manager.blocksView(mx, my+1)) {
                render.floodFill(x,y+1)
                render.floodMap[x][y+1] = 1;
            }
            render.floodStack--;
            if(render.floodStack==0) {
                render.viewable();
            }
        }
    },
    viewable:function() {
        if(!manager.me || !manager.players[manager.me]) {
            return false;
        } else {
            // console.log('viewable')
        }
        cameraX = manager.players[manager.me].x - Math.floor((cameraWidth)/2);
        cameraY = manager.players[manager.me].y - Math.floor((cameraHeight)/2);

        terrainCTX.globalCompositeOperation = 'source-over';
        manager.lights = [];
        // iterate through the floodMap array
        for(var x = 0; x < cameraWidth; x++) {
            for(var y = 0; y < cameraHeight; y++) {

                if(render.floodTouching(x,y)) {

                    var top = y * spriteWidth;
                    var left = x * spriteWidth;

                    // terrain
                    var tile = map[(cameraY + y) * mapHeight + (cameraX + x)];
                    var spriteOffsetLeft = (tile - 1) - ~~((tile-1) / spriteSheetTilesWide) * spriteSheetTilesWide;
                    var spriteOffsetTop = ~~((tile-1) / spriteSheetTilesWide);
                    terrainBufferCTX.drawImage(assets.terrain.canvas, 0, 0, spriteWidth, spriteHeight, left, top, spriteWidth, spriteHeight)
                    terrainBufferCTX.drawImage(assets.terrain.canvas, (spriteOffsetLeft * spriteWidth), (spriteOffsetTop * spriteHeight), spriteWidth, spriteHeight, left, top, spriteWidth, spriteHeight)
                }
            }
        }

        // fixtures (can i use a worker here?)
        for(var fixture in manager.world_fixtures) {
            var fx = manager.world_fixtures[fixture].x-cameraX
            var fy = manager.world_fixtures[fixture].y-cameraY
            if(manager.world_fixtures[fixture].visible && fx>-1&& fy>-1 && fx<cameraWidth && fy<cameraHeight && manager.world_fixtures[fixture].map == manager.activeMap) {
                if(render.floodTouching(fx,fy)) {

                    if(editingFixtures) {
                        $fixture = $("#fixture_" + manager.world_fixtures[fixture].id)

                        if($fixture.length<1) {
                            $fixture = $("<div index='" + manager.world_fixtures[fixture].id + "' id='fixture_" + manager.world_fixtures[fixture].id + "' class='sprite fixture'></div>");
                            $viewportElements.append($fixture);
                        }

                        if($('.fixture.ui-draggable-dragging').length==0) {
                            $fixture.css({left:fx * spriteWidth,top:fy * spriteHeight});
                        }
                    } else {
                        $viewportElements.find('.fixture').remove();
                    }
                    var frame = manager.fixtures[manager.world_fixtures[fixture].fixture].animationType == "random" ? Math.floor(Math.random()*4) * spriteWidth : 0
                    terrainBufferCTX.drawImage(assets.fixtures.canvas, frame, (manager.world_fixtures[fixture].fixture-1)*spriteHeight, spriteWidth, spriteHeight, fx * spriteWidth, fy * spriteHeight, spriteWidth, spriteHeight)

                    if(manager.fixtures[manager.world_fixtures[fixture].fixture].illuminates) {
                        manager.lights.push({x:fx*spriteWidth + spriteWidth / 2, y:fy*spriteHeight + spriteHeight / 2, value:manager.fixtures[manager.world_fixtures[fixture].fixture].illuminates})
                    }

                } else {
                    if(editingFixtures) {
                        if($("#fixture_" + manager.world_fixtures[fixture].id).length>0) {
                            $("#fixture_" + manager.world_fixtures[fixture].id).remove();
                        }
                    }
                }
            }
        }

        // items
        if(typeof manager.players != "undefined" && manager.me!=0) {
            for(var item in manager.world_items) {

                var x = ((manager.world_items[item].x - cameraX) * spriteWidth);
                var y = ((manager.world_items[item].y - cameraY) * spriteHeight);

                var cx = x / spriteWidth;
                var cy = y / spriteHeight;

                if((x>-1 && x < cameraWidth * spriteWidth) && (y>-1 && y < cameraHeight * spriteHeight) && manager.world_items[item].map == manager.activeMap) {
                    if(render.floodTouching(cx,cy)) {
                        var $item = $("#items #item_" + manager.world_items[item].id);
                        if($item.length!=1) {

                            var $item = $("<div item='" + item + "' style='background:url(" + paths.items + manager.items[manager.world_items[item].item].sprite + ".gif);' id='item_" + manager.world_items[item].id + "' index='" + manager.world_items[item].id + "' class='sprite item " + (manager.items[manager.world_items[item].item].notMovable==1 ? "not-movable" : "") + "'></div>")
                            $item.css({opacity:0})
                            $items.append($item);
                            game.map_bindUIEvents($item);

                        }
                        if($item.is('.ui-draggable-dragging') || $item.is('.cloned')) {
                            $item.css('opacity',1);
                        } else {
                            terrainBufferCTX.drawImage(manager.items[manager.world_items[item].item].img, x, y)
                        }


                        $("#items #item_" + manager.world_items[item].id).not('.ui-draggable-dragging').css({left:x,top:y})
                        if(manager.items[manager.world_items[item].item].illuminates) {
                            manager.lights.push({x:x + spriteWidth / 2, y:y + spriteHeight / 2, value:manager.items[manager.world_items[item].item].illuminates})
                        }

                    } else {
                        $("#items #item_" + manager.world_items[item].id).remove();
                    }


                } else {
                    if($("#items #item_" + manager.world_items[item].id).length>0) {
                        $("#items #item_" + manager.world_items[item].id).remove();
                    }
                }
            }
        }
        $items.find('.item').each(function() {
            if(typeof manager.world_items[$(this).attr("index")] == "undefined") {
                $(this).remove();
            }
        });

       // npcs
       if (typeof manager.world_npcs != 'undefined') {
            for(var npc in manager.world_npcs) {
                var x = ((manager.world_npcs[npc].x - cameraX) * spriteWidth);
                var y = ((manager.world_npcs[npc].y - cameraY) * spriteHeight);
                var cx = x / spriteWidth;
                var cy = y / spriteHeight;

                if((x>-1 && x < cameraWidth * spriteWidth)  && (y > -1 && y < cameraHeight * spriteHeight) && manager.world_npcs[npc].map == manager.activeMap) {
                    if(render.floodTouching(cx,cy)) {

                        $npc = $("#npc_" + manager.world_npcs[npc].id)

                        if($npc.length<1) {
                            $npc = $("<div index='" + manager.world_npcs[npc].id + "' id='npc_" + manager.world_npcs[npc].id + "' class='sprite npc " + (manager.npcs[manager.world_npcs[npc].npc].hostile==1?"hostile":"friendly") + "' style='width:" + ((manager.npcs[manager.world_npcs[npc].npc].width*spriteWidth)) + "px; height:" + (manager.npcs[manager.world_npcs[npc].npc].height*spriteHeight) + "px; background-image:url(" + paths.npcs + manager.npcs[manager.world_npcs[npc].npc].sprite + ".png);'><div class='spell spell-" + manager.world_npcs[npc].spell + "'></div></div>");
                            $viewportElements.prepend($npc);
                            $npc.css('opacity', 0)
                        }

                        if(editingNPCs) {
                            if(!$npc.is('.ui-draggable-dragging')) {
                                $npc.css({left:x,top:y})
                            }

                            $npc.css({backgroundPosition: offset + 'px 0px', backgroundColor:'rgba(255,255,255,.5)', opacity:1});
                        } else {
                            $npc.css({left:x,top:y, backgroundPosition: offset + 'px 0px', backgroundColor:'transparent', opacity:0});
                        }

                            // draw to canvas
                            var frame = Math.floor(Math.random()*4) * spriteWidth
                            // console.log(npc, manager.world_npcs[npc], manager.npcs[manager.world_npcs[npc].npc].img)
                            terrainBufferCTX.drawImage(manager.npcs[manager.world_npcs[npc].npc].img, frame, 0, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight)

                            // draw a invisible div on the DOM to handle mouse events
                            //$npc.css({left:x,top:y,backgroundPosition: offset + 'px 0px'});

                            // need to handle spells on canvas

                            // if(manager.world_npcs[npc].spell) {
                            //     $npc.find('.spell').addClass('spell-' +  manager.world_npcs[npc].spell)
                            // } else {
                            //     var npcSpell = $npc.find('.spell')[0]
                            //     npcSpell.className = npcSpell.className.replace(/spell-\w+/gi, '' );
                            // }



                    } else {
                        if($("#npc_" + manager.world_npcs[npc].id).length>0) {
                            $("#npc_" + manager.world_npcs[npc].id).remove();
                        }
                    }
                } else {
                    if($("#npc_" + manager.world_npcs[npc].id).length>0) {
                        $("#npc_" + manager.world_npcs[npc].id).remove();
                    }
                }
            }
        }
        $viewportElements.find('.npc').each(function() {
            if(typeof manager.world_npcs[$(this).attr("index")] == "undefined") {
                $(this).remove();
            }
        });

        // players
        if(typeof manager.players != "undefined" && manager.me!=0) {
            for(var player in manager.players) {
                if(player!=manager.me) {

                    var x = ((manager.players[player].x - cameraX) * spriteWidth);
                    var y = ((manager.players[player].y - cameraY) * spriteHeight);

                    var cx = x / spriteWidth;
                    var cy = y / spriteHeight;

                    if((x>-1 && x < cameraWidth * spriteWidth) && (y>-1 && y < cameraHeight * spriteHeight) && manager.players[player].map == manager.activeMap) {
                        if(render.floodTouching(cx,cy)) {
                           if($("#player_" + manager.players[player].id).length!=1) {
                               var $player = $([
                                   "<div style='background:url(" + paths.players + manager.players[player].sprite + ".png);' id='player_" + manager.players[player].id + "' index='" + manager.players[player].id + "' class='sprite player " + (manager.players[player].gm == 1 ? 'gm':'') + "'>",
                                   "<div class='nametag'><span class='nametag-prefix'>" + manager.players[player].prefix + "</span>" + manager.players[player].name + "</div>",
                                   "&nbsp;</div>"
                               ].join(''))
                               $viewportElements.prepend($player);
                           }
                           if(manager.players[player].criminal) {
                               $("#player_" + manager.players[player].id).find('.nametag').addClass('criminal')
                           } else {
                               $("#player_" + manager.players[player].id).find('.nametag').removeClass('criminal')
                           }
                           var offset = -1 * Math.round(Math.random()*4) * spriteWidth;
                           $("#player_" + manager.players[player].id).css({left:x,top:y,backgroundPosition: offset + 'px 0px'});
                        } else {
                            $("#player_" + manager.players[player].id).remove();
                        }
                    } else {
                       if($("#player_" + manager.players[player].id).length>0) {
                           $("#player_" + manager.players[player].id).remove();
                       }
                    }
                }
            }
        }
        $viewportElements.find('.npc').each(function() {
            if(typeof manager.players[$(this).attr("index")] == "undefined") {
                $(this).remove();
            }
        });

         // draw terrain buffer
         terrainCTX.drawImage(terrainBufferElement,0,0)

         render.lighting();

    },
    lighting:function() {

        manager.lights.push({x:cameraWidth * spriteWidth / 2, y:cameraHeight * spriteHeight / 2, value:.5})

        // fill canvas with total darkness
        lightingCTX.fillStyle='rgba(0,0,0,1)'
        lightingCTX.globalCompositeOperation = 'source-over'
        lightingCTX.fillRect(0,0,terrainElement.width,terrainElement.height)

        // clear it up a bit
        lightingCTX.fillStyle="rgba(0,0,0, " + manager.lightValue + ")";
        lightingCTX.globalCompositeOperation = 'destination-out'
        lightingCTX.fillRect(0,0,terrainElement.width,terrainElement.height)

        // set the fill style to provide a gaussian blur
        lightingCTX.fillStyle="rgba(0,0,0,.05)";

        for(var i=0;i<manager.lights.length; i++) {
            for(var r = 1; r< 60 * manager.lights[i].value + Math.random()*3; r++) {
                lightingCTX.beginPath();
                lightingCTX.arc(manager.lights[i].x, manager.lights[i].y, r*1.5, 0, Math.PI*2, true);
                lightingCTX.closePath();
                lightingCTX.fill();
            }
        }

        terrainCTX.globalCompositeOperation = 'source-over';
        terrainCTX.drawImage(lightingElement, 0, 0);
    },
    minimap:function() {
        newMinimapX = (cameraX*-2) + 88
        newMinimapY = (cameraY*-2) + 65
        if(minimapX!=newMinimapX || minimapY!=newMinimapY) {
            minimapX = (cameraX*-2) + 88
            minimapY = (cameraY*-2) + 65
            $('#map-image').css({backgroundPosition: minimapX + 'px ' + minimapY + 'px'});
        }
    },
    me:function() {
        var offset = -1 * Math.round(Math.random()*4) * spriteWidth;
        $me.css({backgroundPosition: offset + 'px 0px', height:32});
    },
    playerData:function() {
        // todo: cleanup

        // if(typeof manager.players == "undefined" || manager.me==0 || !manager.players[manager.me]) return false;
        // $playerHPvalue.css({width: ((manager.players[manager.me].hp / manager.players[manager.me].maxhp) * 96.7) + '%'})
        // $playerXPvalue.css({width: ((manager.levels[manager.playerData.level-1] - manager.players[manager.me].xp) / (manager.levels[manager.playerData.level-1] - manager.levels[manager.playerData.level]) * 96.7) + '%'})
        // var levelxp = manager.levels[manager.playerData.level];
        // $playerHPlabel.text('HP: ' + manager.players[manager.me].hp + ' / ' + manager.players[manager.me].maxhp)
        // $playerXPlabel.text('XP: ' + manager.players[manager.me].xp + ' / ' + manager.levels[manager.playerData.level])
        // $('#weight').text((manager.inventory.weight).toFixed() + ' / ' + manager.playerData.maxWeight)
        // $('#level').text(manager.playerData.level)

        // if($('#icon-character').is('.active')) {
        //     $('#str').text(manager.playerData.str);
        //     $('#dex').text(manager.playerData.dex);
        //     $('#con').text(manager.playerData.con);
        //     $('#int').text(manager.playerData.int);
        //     $('#armor').text(manager.playerData.armor);

        //     $('#player-level').text('Level ' + manager.playerData.level)

        //     // show attribute points
        //     if(manager.playerData.attributePoints>0) {
        //         $('#stats-points #point-str').css({visibility:manager.playerData.str<100 ? 'visible':'hidden'})
        //         $('#stats-points #point-dex').css({visibility:manager.playerData.dex<100 ? 'visible':'hidden'})
        //         $('#stats-points #point-int').css({visibility:manager.playerData.int<100 ? 'visible':'hidden'})
        //         $('#stats-points #point-con').css({visibility:manager.playerData.con<100 ? 'visible':'hidden'})
        //     } else {
        //         $('#stats-points li').css({visibility:'hidden'})
        //     }
        // }
    },
    inventory:function() {
        // for(var i in manager.inventory.items) {
        //     if(manager.inventory.items[i].equipped!=0) {
        //         if(!$('#character .equipment[slot="' + manager.inventory.items[i].equipped + '"] .item[item="' + manager.inventory.items[i].id + '"]').length) {
        //             $insert = $('<div class="item sprite" itemtype="' + manager.inventory.items[i].item + '" item="' + manager.inventory.items[i].id + '"><div>');
        //             $insert.css({background:'url(' + paths.items + manager.items[manager.inventory.items[i].item].sprite + '.gif)'});
        //             $insert.appendTo($('#character .equipment[slot="' + manager.inventory.items[i].equipped + '"]'));
        //         }

        //         // remove it from inventory
        //         $('#inventory .item[item="' + manager.inventory.items[i].id + '"]').remove();
        //     } else {
        //         var $item = $('#inventory .item[item="' + manager.inventory.items[i].id + '"]')

        //         if(!$item.length) {
        //             $item = $('<div class="item sprite ' + (manager.items[manager.inventory.items[i].item].soulbound ? 'soulbound':'') + '" item="' + manager.inventory.items[i].id + '" itemtype="' + manager.inventory.items[i].item + '"><div>');
        //             $item.appendTo($('#inventory .items'));

        //             if(manager.items[manager.inventory.items[i].item].stackable==1) {
        //                 $item.addClass('stackable')
        //             }
        //             $item.css({
        //                 top:manager.inventory.items[i].y,
        //                 left:manager.inventory.items[i].x,
        //                 background:'url(' + paths.items + manager.items[manager.inventory.items[i].item].sprite + '.gif)'
        //             })
        //         }

        //         // remove it from equipped area
        //         $('#character .item[item="' + manager.inventory.items[i].id + '"]').remove();
        //     }
        // }
    },
    target:function() {
        if(manager.playerData.target && manager.playerData.target!=0) {
            if(manager.playerData.targetType==TYPE_NPC && typeof manager.world_npcs[manager.playerData.target] != 'undefined') {
                var x = manager.world_npcs[manager.playerData.target].x;
                var y = manager.world_npcs[manager.playerData.target].y;
                var hp = manager.world_npcs[manager.playerData.target].hp;
                var maxhp = manager.world_npcs[manager.playerData.target].maxhp
            }
            if(manager.playerData.targetType==TYPE_PLAYER && typeof manager.players[manager.playerData.target] != 'undefined') {
                var x = manager.players[manager.playerData.target].x;
                var y = manager.players[manager.playerData.target].y;
                var hp = manager.players[manager.playerData.target].hp;
                var maxhp = manager.players[manager.playerData.target].maxhp
            }
            if(x>cameraX && x < cameraX + cameraWidth && y > cameraY && y < cameraY + cameraHeight) {
                var top = ((y - cameraY) * spriteHeight) + spriteHeight;
                var left = (x - cameraX) * spriteWidth - 2;
                $target.css({top:top, left:left});
                $targetValue.css({width:(hp / maxhp * 100) + '%'})
            } else {
                $target.css({left:-999});
            }
        } else {
            $target.css({left:-999});
        }
    },
    damage:function(data) {
        if(typeof manager.npcs == 'undefined' || typeof manager.players == 'undefined' || typeof manager.world_npcs == 'undefined') return false;
        if(data.attackerType == TYPE_NPC && manager.world_npcs[data.attacker].map != manager.activeMap) return false;
        if(data.attackerType == TYPE_PLAYER && manager.players[data.attacker].map != manager.activeMap) return false;

        if(data.attacker==manager.me) {
            var combatLogName = data.targetType==TYPE_NPC ? manager.npcs[manager.world_npcs[data.target].npc].name : manager.players[data.target].name;
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
            var combatLogName = data.attackerType==TYPE_NPC ? manager.npcs[manager.world_npcs[data.attacker].npc].name : manager.players[data.attacker].name;
            var combatLogColor= 'red';
        }

        // add to combat log if player is being attacked, or player is attacking
        if(data.attacker == manager.me || data.target == manager.me) {
            addCombatLog('<span style="color:' + combatLogColor + '">' + combatLogName + ': ' + data.damage + '</span>');
        }

        if(data.attacker==manager.me) {
            if(data.targetType==TYPE_NPC) {
                if($("#npc_" + data.target).length>0) {
                    textPlacementY = $("#npc_" + data.target).position().top;
                    textPlacementX= $("#npc_" + data.target).position().left - spriteWidth / 2;
                    render.floatingText(data.damage, textPlacementX, textPlacementY, data.crit ? 'white' : '#1cb800', data.crit ? 40 : 20)
                }
            }
            if(data.targetType==TYPE_PLAYER) {
                if($("#player_" + data.target).length>0) {
                    textPlacementY = $("#player_" + data.target).position().top;
                    textPlacementX= $("#player_" + data.target).position().left - spriteWidth / 2;
                    render.floatingText(data.damage, textPlacementX, textPlacementY, data.crit ? 'white' : '#1cb800', data.crit ? 40 : 20)
                }
            }
        }

        if("ranged" in data && data.ranged) {
            var projectile = {id:(new Date()).getTime()}

            if(data.attacker == manager.me && data.attackerType == TYPE_PLAYER) {
                projectile.x1 = cameraWidth*spriteWidth / 2 - spriteWidth / 2;
                projectile.y1 = cameraHeight*spriteHeight / 2 - spriteHeight / 2;
            } else {
                projectile.x1 = (manager.players[data.attacker].x - cameraX) * spriteWidth
                projectile.y1 = (manager.players[data.attacker].y - cameraY) * spriteHeight
            }

            if(data.targetType == TYPE_NPC) {
                projectile.x2 = (manager.world_npcs[data.target].x - cameraX) * spriteWidth
                projectile.y2 = (manager.world_npcs[data.target].y - cameraY) * spriteHeight
            }

            if(data.targetType == TYPE_PLAYER) {
                if(data.target == manager.me) { // if im the target send it to the center of my screen
                    projectile.x2 = cameraWidth * spriteWidth / 2 - spriteWidth / 2;
                    projectile.y2 = cameraHeight * spriteHeight / 2 - spriteHeight / 2;
                } else {
                    projectile.x2 = (manager.players[data.target].x - cameraWidth) *spriteWidth
                    projectile.y2 = (manager.players[data.target].y - cameraHeight) * spriteHeight
                }
            }

            $viewportElements.append("<img id='projectile_" + projectile.id + "' class='sprite projectile' src='" + paths.items + manager.items[data.ranged].projectileSprite + ".gif'>");
            projectile.rotate = Math.atan2(projectile.y2 - projectile.y1, projectile.x2 - projectile.x1) / Math.PI * 180 - 90;

            $("#projectile_" + projectile.id).css({
                top:projectile.y1,
                left:projectile.x1,
                "-webkit-transform":"rotate(" + projectile.rotate + "deg)"
            }).animate({
                top:projectile.y2,
                left:projectile.x2
            },200,'linear',function() {
                $(this).remove();
            });
        }

        setTimeout(function(target, type) {
            if(parseInt(data.attacker)==manager.me) {
                if(data.targetType==TYPE_NPC) {
                    if(data.hasOwnProperty("xp")) {
                        manager.playerData.stats.xp = data.xp;
                    }
                };
            };

            if(target==manager.me) {
                $elm = $("#me");
            } else {
                if(type==TYPE_NPC) { $elm = $("#npc_" + target); }
                if(type==TYPE_PLAYER) { $elm = $("#player_" + target); }
            }
            var damageX = 0;
            var damageY = 0;
            if(type==TYPE_NPC && typeof manager.world_npcs[target] !="undefined" ) {
                damageX = manager.world_npcs[target].x-cameraX
                damageY = manager.world_npcs[target].y-cameraY
            }
            if(type==TYPE_PLAYER && typeof manager.players[target] !="undefined") {
                damageX = manager.players[target].x-cameraX
                damageY = manager.players[target].y-cameraY
            }
            $elm.append("<div class='sprite damage'></div>")
            setTimeout(function($elm) {
                $elm.find('.damage').remove()
            },300, $elm)

        },("delay" in data ? data.delay : 0),data.target,data.targetType)












    },
    missed:function(data) {
        if(parseInt(data.target)==manager.me) {
            console.log('missed!')
            $elm = $("#me");
        } else {
            if(data.targetType==TYPE_NPC) { $elm = $("#npc_" + data.target); }
            if(data.targetType==TYPE_PLAYER) { $elm = $("#player_" + data.target); }
        }
        $elm.find('.missed').remove();
        $elm.append("<div class='sprite missed'></div>")
        setTimeout(function($elm) {
            $elm.find('.missed').remove()
        },300, $elm)

        if("ranged" in data && data.ranged) {
            var projectile = {id:(new Date()).getTime()}

            if(data.attacker == manager.me && data.attackerType == TYPE_PLAYER) {
                projectile.x1 = cameraWidth*spriteWidth / 2 - spriteWidth / 2;
                projectile.y1 = cameraHeight*spriteHeight / 2 - spriteHeight / 2;
            } else {
                projectile.x1 = (manager.players[data.attacker].x - cameraX) * spriteWidth
                projectile.y1 = (manager.players[data.attacker].y - cameraY) * spriteHeight
            }

            if(data.targetType == TYPE_NPC) {
                projectile.x2 = (manager.world_npcs[data.target].x - cameraX) * spriteWidth
                projectile.y2 = (manager.world_npcs[data.target].y - cameraY) * spriteHeight
            }

            if(data.targetType == TYPE_PLAYER) {
                if(data.target == manager.me) { // if im the target send it to the center of my screen
                    projectile.x2 = cameraWidth * spriteWidth / 2 - spriteWidth / 2;
                    projectile.y2 = cameraHeight * spriteHeight / 2 - spriteHeight / 2;
                } else {
                    projectile.x2 = (manager.players[data.target].x - cameraWidth) *spriteWidth
                    projectile.y2 = (manager.players[data.target].y - cameraHeight) * spriteHeight
                }
            }

            $viewportElements.append("<img id='projectile_" + projectile.id + "' class='sprite projectile' src='" + paths.items + manager.items[data.ranged].projectileSprite + ".gif'>");
            projectile.rotate = Math.atan2(projectile.y2 - projectile.y1, projectile.x2 - projectile.x1) / Math.PI * 180 - 90;

            $("#projectile_" + projectile.id).css({
                top:projectile.y1,
                left:projectile.x1,
                "-webkit-transform":"rotate(" + projectile.rotate + "deg)"
            }).animate({
                top:projectile.y2,
                left:projectile.x2
            },200,'linear',function() {
                $(this).remove();
            });
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
            top:y - size * 2
        },{
            duration:500,
            easing:"easeOutElastic",
            complete:function() {
                $("#ft_" + thisFT).animate({
                    top:y - spriteHeight * 2 - 100,
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
    },
    bank:function(data) {
        manager.bank = data;
        for(var i in data) {
            $insert = $('<div class="item sprite ' + (manager.items[data[i].item].stackable==1?'stackable':'') + '" item="' + data[i].id + '" itemtype="' + data[i].item + '"><div>');
            $insert.appendTo($('#bank .items'));
            $insert.draggable();

            $('#bank .item[item="' + data[i].id + '"]').css({
                top:data[i].y,
                left:data[i].x,
                background:'url(' + paths.items + manager.items[data[i].item].sprite + '.gif)'
            });
        }
    }
}
