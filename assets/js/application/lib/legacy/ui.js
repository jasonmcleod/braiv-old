$(function() {


    // $chat.jScrollPane();

    // work around for random droparea being stuck
    // $('body').bind('mouseup', function() {
    //     setTimeout(function() {
    //         $droparea.hide()
    //     },10);
    // })

    // clicking on icons toggles their windows
    // $('#icon-inventory, #icon-character, #icon-map, #icon-chat, #icon-quest').bind('click', toggleWindow).bind('touchstart',toggleWindow);


    // single/double clicking the map
    $viewport.single_double_click(function(e) {

        var tileX = Math.round(((e.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
        var tileY = Math.round(((e.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
        var mapX = tileX + cameraX;
        var mapY = tileY + cameraY;
        var target = e.button == 2;

        //if(render.floodMap[tileX][tileY]==0) return false;

        $targetElm = $(e.target);

        if($targetElm.is('.npc')) {
            if(input.control) {
                console.log(JSON.stringify(manager.world_npcs[$targetElm.attr('index')]))
            }
        }

        if(e.button == 2 && manager.targetProtection && ($targetElm.is('.npc.friendly') || $targetElm.is('.npc.guard') || $targetElm.is('.player'))) {
            addLog('Target protection has prevented you from targeting this ' + ($(this).is('.player') ? 'player':'npc'))

            return false;
        }

        // socket.emit('identify',{target:target, x:mapX, y:mapY});
        socket.post('/map/identify', {x:mapX, y:mapY}, function(data) {
            console.log(data);
        })
        //socket.emit('useonmap',{x: mapX, y: mapY});

    },function(e) {
        e.preventDefault();
        var tileX = Math.round(((e.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
        var tileY = Math.round(((e.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
        var mapX = tileX + cameraX;
        var mapY = tileY + cameraY;

        // todo: move to directive
        socket.post('/map/use', {x:mapX, y:mapY}, function(data) {
            console.log(data);
        });
        // socket.emit('useonmap',{x: mapX, y: mapY});
    });

    // keyboard shortcuts
    // $(document).keydown(function(e) {

    //     switch(e.keyCode) {
    //         case 13: // enter
    //             if(connected) {
    //                 if($split.is(':visible')) {
    //                     $('.split-ok').click();
    //                     break;
    //                 }
    //                 if($inputWrapper.find('input').is(':focus')) {
    //                     sendChat();
    //                     $inputWrapper.find('input').val('').blur();
    //                     $inputWrapper.hide();
    //                 } else {
    //                     $inputWrapper.show()
    //                     $inputWrapper.find('input').focus();
    //                 }
    //             } else {
    //                 if($('#characters .character').length>0) {
    //                     $('#enter-world').click();
    //                     $('#container').click();
    //                     return false;
    //                 }
    //             }
    //             break;

    //         case 191: // slash
    //             if(e.shiftKey || $('input:focus').length > 0) break;
    //             $inputWrapper.show()
    //             $inputWrapper.find('input').focus().val('/');
    //             return false;
    //             break;

    //         case 116: // F5
    //             toggleTargetProtection();
    //             return false;
    //             break;

    //         case 8: // backspace
    //             if($('input:focus').length<=0) {
    //                 return false;
    //             }
    //             break;

    //         case 27: // escape

    //             // cancel split dialog
    //             if($split.is(':visible')) {
    //                 $('.split-cancel').click();
    //                 break;
    //             }

    //             // cancel chat entry
    //             if($inputWrapper.find('input').is(':visible')) {
    //                 $inputWrapper.find('input').val('').blur();
    //                 $inputWrapper.hide();
    //                 break;
    //             }

    //             // clear target
    //             if(manager.playerData.target!=0) {
    //                 socket.emit('nulltarget');
    //                 break;
    //             }

    //             // close inventory
    //             if($('#bank').is(':visible')) {
    //                 bank.close();
    //                 break;
    //             }

    //             // close inventory
    //             if($('#icon-inventory').is('.active')) {
    //                 $('#icon-inventory').click();
    //                 break;
    //             }

    //             // close character
    //             if($('#icon-character').is('.active')) {
    //                 $('#icon-character').click();
    //                 break;
    //             }

    //             // close map
    //             if($('#icon-map').is('.active')) {
    //                 $('#icon-map').click();
    //                 break;
    //             }


    //         case 9: // tab
    //             if(connected) {
    //                 socket.emit('autoloot');
    //                 return false;
    //             }
    //             break;

    //         case 77: // M
    //             if($('input:focus').length<=0) {
    //                 $('#icon-map').click();
    //                 return false;
    //             }
    //             break;

    //         case 73: // I
    //             if($('input:focus').length<=0) {
    //                 $('#icon-inventory').click();
    //                 return false;
    //             }
    //             break;

    //         case 66: // B
    //             if($('input:focus').length<=0) {
    //                 $('#icon-inventory').click();
    //                 return false;
    //             }
    //             break;


    //         case 67: // C
    //             if($('input:focus').length<=0) {
    //                 $('#icon-character').click();
    //                 return false;
    //             }
    //             break;

    //         case 77: // M
    //             if($('input:focus').length<=0) {
    //                 $('#icon-map').click();
    //                 return false;
    //             }
    //             break;
    //     }

    // });

    // shift + hover to target
    $('.npc, .player:not("#viewport-me")').bind('mousemove', function() {
        pos = $(this).position()
        var tileX = Math.round((pos.left) / spriteWidth);
        var tileY = Math.round((pos.top) / spriteHeight);

        if(input.shift) {
            if(manager.targetProtection && ($(this).is('.player') || $(this).is('.friendly'))) return false;

            var type = $(this).is('.npc') ? TYPE_NPC : TYPE_PLAYER;

            mouseTargetObject = {id:$(this).attr('index'), type:type};
            if(mouseTargetObjectBuffer.id!=mouseTargetObject.id) {
                socket.emit('target', mouseTargetObject);
                mouseTargetObjectBuffer = mouseTargetObject;
            }
        }
    });

    // draggable boxes
    // $('#map, #character, #inventory, #bank').draggable({
    //     snap:boxSnapSelectors,
    //     handle:'.title',
    //     zIndex:250
    // });

    // clicking, doubleclicking, and moving inventory items
    $('#inventory .item').bind('mouseenter',function() {

        $(this).draggable({
            grid:[2,2],
            helper:'clone',
            appendTo:'body',
            zIndex:210,
            start:function(e,ui) {
                $(this).data('dragging', true)
                $(this).data("oldX",$(this).position().left);
                $(this).data("oldY",$(this).position().top);
                $(this).css({zIndex:1000});
                $(this).hide();
                $(this).data('from','inventory')
                // $droparea.show();
                $("#inventory .item.stackable").droppable({
                    greedy:true,
                    drop:function(e,ui) {
                        // same item?
                        console.log('inv > inv stack')
                        if($(this).attr("itemtype") == $(ui.draggable[0]).attr('itemtype')) {
                            socket.emit('inventory_stack',{drop:$(this).attr("item"), drag: $(ui.draggable[0]).attr('item'), to:'inventory' })
                            $(ui.draggable[0]).addClass('deleted');
                            $(ui.helper[0]).remove();
                            // $droparea.hide();
                        }
                    }
                });

                $("#bank .item.stackable").droppable({

                    greedy:true,
                    drop:function(e,ui) {
                        console.log('drop on bank')
                        // same item?
                        if($(this).attr("itemtype") == $(ui.draggable[0]).attr('itemtype')) {
                            socket.emit('inventory_stack',{drop:$(this).attr("item"), drag: $(ui.draggable[0]).attr('item'), to:'bank' })
                            $(ui.draggable[0]).addClass('deleted');
                            $(ui.helper[0]).remove();
                            //$droparea.hide();
                        }
                    }
                });

            },
            stop:function(e,ui) {
                if($(this).is('.deleted')) return false;
                setTimeout(function(e) { $(e).data('dragging',false); },400,this); // clears the dragging flag to prevent drag + identify
                var i = $(this).attr('item');
                var x = ui.offset.left - $("#inventory").offset().left - spriteWidth / 2 + 4;
                var y = ui.offset.top - $("#inventory").offset().top - spriteHeight / 2 + 4 ;

                if(!e.shiftKey && x > 0 && x < $("#inventory").width() && y > 0 && y < $("#inventory").height()) {
                    $(this).show().css({top:y, left:x});
                    socket.emit('inventory_move',{item:i, x:x, y:y})
                } else {
                    $(this).show();
                }
                //$droparea.hide();
            }
        });

        // inventory items
        $(this).single_double_click(function(e) {
            if($(this).data('dragging')) return false;
            var i = $(this).attr('item');
            if(e.altKey && game.players[game.me].gm==1) {
                socket.emit('edit_item', {item:$(this).attr('itemtype')})
            } else {
                socket.emit('inventory_identify', {item:i})
            }
        },function() {
            var i = $(this).attr('item');
            socket.emit('inventory_use', {item:i})
        });

    });

    $('.container .item').bind('mouseenter',function() {

        if(!manager.world_items[$(this).attr('container')].lookonly || manager.world_items[$(this).attr('container')].lookonly && manager.world_items[$(this).attr('container')].owner == manager.me) {

            $(this).draggable({
                helper:'clone',
                appendTo:'body',
                zIndex:3001,
                start:function(e,ui) {
                    //render.attackMode();
                    $(this).data('dragging', true)
                    $(this).data("oldX",$(this).position().left);
                    $(this).data("oldY",$(this).position().top);
                    $(this).css({zIndex:2001});
                    $(this).hide();
                    //$droparea.show();
                    $(".container .item.stackable").droppable({
                        greedy:true,
                        drop:function(e,ui) {
                            // same item?
                            if($(this).attr("itemtype") == $(ui.draggable[0]).attr('itemtype')) {
                                console.warn('TODO: stack container item')
                                $(ui.draggable[0]).addClass('deleted');
                                $(ui.helper[0]).remove();
                                //$droparea.hide();
                            }
                        }
                    });
                },
                stop:function(e,ui) {
                    if($(this).is('.deleted')) return false;
                    setTimeout(function(e) { $(e).data('dragging',false); },400,this); // clears the dragging flag to prevent drag + identify
                    var i = $(this).attr('item');
                    var x = ui.offset.left - $('.container[container="' + $(this).attr('container') + '"]').offset().left - spriteWidth / 2 + 4;
                    var y = ui.offset.top - $('.container[container="' + $(this).attr('container') + '"]').offset().top - spriteHeight / 2 + 4;

                    var x = ui.offset.left - $("#bank").offset().left - spriteWidth / 2 + 4;
                    var y = ui.offset.top - $("#bank").offset().top - spriteHeight / 2 + 4 ;

                    if(x > 0 && x < $('.container[container="' + $(this).attr('container') + '"]').width() && y > 0 && y < $('.container[container="' + $(this).attr('container') + '"]').height()) {
                        $(this).show().css({top:y, left:x});
                        console.warn('TODO: move container item')
                    } else {
                        $(this).show();
                    }
                    //$droparea.hide();
                }
            });
        }

        // inventory items
        $(this).single_double_click(function(e) {
            if($(this).data('dragging')) return false;
            var i = $(this).attr('item');
            var value = $(this).attr('value')
            socket.emit('inventory_identify', {item:i})
            //addLog('You see ' + (value==1?'a':value) + ' ' + manager.items[i].name)
        },function() {
            console.warn('TODO: use container item')
            //var i = $(this).attr('item');
            //game.socket.emit('inventory_use', {item:i})
        });

    });

    // clicking, doubleclicking, and moving bank items
    $('#bank .item').bind('mouseenter',function() {
        $(this).draggable({
            grid:[2,2],
            helper:'clone',
            appendTo:'body',
            zIndex:250,
            start:function(e,ui) {
                $(this).data('dragging', true)
                $(this).data("oldX",$(this).position().left);
                $(this).data("oldY",$(this).position().top);
                $(this).data('from', 'bank')
                $(this).hide();
                //$droparea.show();

                $("#inventory .item.stackable").droppable({
                    greedy:true,
                    drop:function(e,ui) {
                        // same item?
                        if($(this).attr("itemtype") == $(ui.draggable[0]).attr('itemtype')) {
                            game.socket.emit('bank_stack',{drop:$(this).attr("item"), drag: $(ui.draggable[0]).attr('item'), to:'inventory' })
                            $(ui.draggable[0]).addClass('deleted');
                            $(ui.helper[0]).remove();
                            //$droparea.hide();
                        }
                    }
                });

                $("#bank .item.stackable").droppable({

                    greedy:true,
                    drop:function(e,ui) {
                        console.log('drop on bank')
                        // same item?
                        if($(this).attr("itemtype") == $(ui.draggable[0]).attr('itemtype')) {
                            socket.emit('bank_stack',{drop:$(this).attr("item"), drag: $(ui.draggable[0]).attr('item'), to:'bank' })
                            $(ui.draggable[0]).addClass('deleted');
                            $(ui.helper[0]).remove();
                            //$droparea.hide();
                        }
                    }
                });
            },
            stop:function(e,ui) {
                setTimeout(function(e) { $(e).data('dragging',false); },400,this); // clears the dragging flag to prevent drag + identify
                var i = $(this).attr('item');

                var x = ui.offset.left - $("#bank").offset().left - spriteWidth / 2 + 4;
                var y = ui.offset.top - $("#bank").offset().top - spriteHeight / 2 + 4 ;


                if(!e.shiftKey && x > 0 && x < $("#bank").width() && y > 0 && y < $("#bank").height()) {
                    $(this).show().css({top:y, left:x});
                    socket.emit('bank_move',{item:i, x:x, y:y})
                } else {
                    $(this).show();
                }
                //$droparea.hide();
            }
        });

        // inventory items
        $(this).single_double_click(function(e) {
            if($(this).data('dragging')) return false;
            var i = $(this).attr('item');
            socket.emit('bank_identify', {item:i})
        },function() {
            var i = $(this).attr('item');
            socket.emit('bank_use', {item:i})
        });

    });

    // split slider
    $('#split .slider').slider({
        min:0,
        max:100,
        value:50,
        slide:function(e, ui) {
            $('#split input[name="split-value"]').val(ui.value)
        }
    }).find('.ui-slider-handle').removeClass('ui-corner-all');

    // split slider keyboard input
    $('#split input[name="split-value"]').bind('keyup', function () {
        var max = $('#split .max').text();
        var min = $('#split .min').text();
        var value = this.value;
        if(parseInt(value) > max) { this.value = max }
        if(parseInt(value) < min) { this.value = min }

        $("#split .slider").slider("value", parseInt(value));
    });

    // clicking, double clicking and dragging equipped items
    $('#character .item').bind('mouseenter',function() {
        $(this).draggable({
            grid:[2,2],
            helper:'clone',
            appendTo:'body',
            zIndex:250,
            start:function(e,ui) {
                $(this).data('dragging', true)
                $(this).data("oldX", 0);
                $(this).data("oldY", 0);
                $(this).hide();
                //$droparea.show();
            },
            stop:function(e,ui) {
                setTimeout(function(e) { $(e).data('dragging',false); },400,this); // clears the dragging flag to prevent drag + identify
                var i = $(this).attr('item');
                var x = 0;
                var y = 0;
                $(this).show().css({top:y, left:x});
                //$droparea.hide();
            }
        });

        // inventory items
        $(this).single_double_click(function(e) {
            if($(this).data('dragging')) return false;
            var i = $(this).attr('item');
            if(e.altKey && manager.players[manager.me].gm==1) {
                socket.emit('edit_item', {item:$(this).attr('itemtype')})
            } else {
                socket.emit('equipment_identify', {item:i})
            }
        },function() {
            var i = $(this).attr('item');
            socket.emit('eqipment_unequip', {item:i})
        });

    });

    // clicking, double clicking, and dragging map items
    // $('#items .item:not(".not-movable")').bind('mouseenter',function() {
    //     console.log('enter item')
    //     var x = $(this).position().left;
    //     var y = $(this).position().top;

    //     // todo: use math and screensize to come up with these numbers
    //     if(x >= 256 && x <=384 && y>= 224 && y<= 288) {
    //         console.log(x + ', ' + y)
    //         $(this).draggable({
    //             zIndex:250,
    //             start:function(e,ui) {
    //                 $(this).data("oldX",$(this).position().left);
    //                 $(this).data("oldY",$(this).position().top);
    //                 $(this).css({zIndex:1000});
    //                 $droparea.show();
    //                 $("#inventory .item.stackable").droppable({
    //                     accept:"#inventory .item.stackable",
    //                     drop:function(e,ui){
    //                         socket.send({inventory_stack:{drag:$(this).attr("id").split("_")[1],drop:ui.draggable[0].id.split("_")[1]}})
    //                     }
    //                 });
    //             }
    //         })
    //     } else {
    //         if($(this).is('.ui-draggable')) {
    //             $(this).draggable('destroy')
    //         }
    //     }
    // });

    // when dropping items on the map
    // $droparea.droppable({
    //     accept:".item",
    //     revert:false,
    //     drop:function(e,ui) {

    //         var dropX = ui.offset.left - $(this).offset().left + spriteWidth/2
    //         var dropY = ui.offset.top - $(this).offset().top + spriteHeight/2
    //         var tileX = dropX <= spriteWidth ? -1:dropX >= spriteWidth*2 ? 1:0;
    //         var tileY = dropY <= spriteHeight ? -1:dropY >= spriteHeight*2 ? 1:0;

    //         var item = $(ui.draggable[0]).attr('item');
    //         var itemType = $(ui.draggable[0]).attr('itemtype');
    //         if(tileX == 0 && tileY == 0) {
    //             if($(ui.draggable).is('#items .item')) {
    //                 $(ui.draggable).remove();

    //                 socket.emit('worlditem_to_inventory', {
    //                     stack: true,
    //                     item: item,
    //                     equip:false,
    //                     x: randomRange(0, $("#inventory").width() - 20),
    //                     y: randomRange(12, $("#inventory").height() - 32)
    //                 });
    //             }
    //         } else {
    //             // todo: make sure we can drop on this tile

    //             if(manager.canWalkOnTile(manager.players[manager.me].x + tileX, manager.players[manager.me].y + tileY)) {

    //                 // world items
    //                 if($(ui.draggable).is('#items .item')) {
    //                     $(ui.draggable).remove();
    //                     socket.emit('worlditem_move', {item:item, x:tileX, y: tileY});
    //                 }

    //                 // inventory items
    //                 if($(ui.draggable).is('#inventory .item')) {
    //                     if(manager.items[itemType].soulbound==0) {
    //                         $(ui.draggable).remove();
    //                     }
    //                     socket.emit('inventory_drop', {item:item, x:tileX, y: tileY})
    //                 }

    //                 // bank items
    //                 if($(ui.draggable).is('#bank .item')) {
    //                     if(manager.items[itemType].soulbound==0) {
    //                         $(ui.draggable).remove();
    //                     }
    //                     socket.emit('bank_drop', {item:item, x:tileX, y: tileY})
    //                 }

    //                 // equipped items
    //                 if($(ui.draggable).is('#character .item')) {
    //                     $(ui.draggable).remove();
    //                     socket.emit('equipment_drop', {item:item, x:tileX, y: tileY})
    //                 }
    //             }
    //         }
    //         //$droparea.hide();
    //     }
    // });

    // when dropping items in the inventory
    $inventory.droppable({
        revert:false,
        drop:function(e,ui) {

            if(e.shiftKey) {
                var item = $(ui.draggable[0]).attr('item');
                var from = $(ui.draggable[0]).data('from');
                $(ui.draggable).remove();

                console.log(from)
                $split.data('to','inventory')
                socket.emit('splitstart', {
                    from:from,
                    item: item,
                    equip:false,
                    x: ui.offset.left - $inventory.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $inventory.offset().top - spriteHeight / 2 + 4
                });

                //$('#droparea').hide();
                return false;
            }

            if($(ui.draggable).is('#items .item')) {
                var item = $(ui.draggable[0]).attr('item');
                $(ui.draggable).remove();

                socket.emit('worlditem_to_inventory', {
                    stack: false,
                    item: item,
                    equip:false,
                    x: ui.offset.left - $inventory.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $inventory.offset().top - spriteHeight / 2 + 4
                });
            }
            if($(ui.draggable).is('#bank .item')) {
                var item = $(ui.draggable[0]).attr('item');
                $(ui.draggable).remove();

                socket.emit('bank_to_inventory', {
                    stack: true,
                    item: item,
                    equip:false,
                    x: ui.offset.left - $inventory.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $inventory.offset().top - spriteHeight / 2 + 4
                });
            }
            if($(ui.draggable).is('#character .item')) {
                var item = $(ui.draggable[0]).attr('item');
                $(ui.draggable).remove();

                socket.emit('equipment_unequip', {
                    item: item,
                    x: ui.offset.left - $inventory.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $inventory.offset().top - spriteHeight / 2 + 4
                });
            }

            if($(ui.draggable).is('.container .item')) {
                var item = $(ui.draggable[0]).attr('item');
                var index = $(ui.draggable[0]).attr('index');
                var container = $(ui.draggable[0]).attr('container');
                $(ui.draggable).remove();

                socket.emit('container_to_inventory', {
                    container:container,
                    index: index,
                    x: ui.offset.left - $inventory.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $inventory.offset().top - spriteHeight / 2 + 4,
                    stack:true
                });
            }
            //$droparea.hide();
        }
    });

    // when dropping items in the bank
    $bank.droppable({
        accept:".item",
        revert:false,
        drop:function(e,ui) {

            if(e.shiftKey) {
                var item = $(ui.draggable[0]).attr('item');
                var from = $(ui.draggable[0]).data('from');
                $(ui.draggable).remove();

                console.log(from)
                $split.data('to','bank')
                socket.emit('splitstart', {
                    from:from,
                    item: item,
                    equip:false,
                    x: ui.offset.left - $bank.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $bank.offset().top - spriteHeight / 2 + 4
                });

                //$('#droparea').hide();
                return false;
            }

            if($(ui.draggable).is('#items .item')) {
                var item = $(ui.draggable[0]).attr('item');
                $(ui.draggable).remove();

                socket.emit('worlditem_to_bank', {
                    stack: true,
                    item: item,
                    x: ui.offset.left - $bank.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $bank.offset().top - spriteHeight / 2 + 4,
                });
            }
            if($(ui.draggable).is('#inventory .item') || $(ui.draggable).is('#character .item')) {
                var item = $(ui.draggable[0]).attr('item');
                console.log(item)
                $(ui.draggable).remove();
                socket.emit('inventory_to_bank', {
                    item: item,
                    x: ui.offset.left - $bank.offset().left - spriteWidth / 2 + 4,
                    y: ui.offset.top - $bank.offset().top - spriteHeight / 2 + 4
                });
            }
            //$('#droparea').hide();
        }
    });

    // when dropping items in the character dialog
    $character.droppable({
        accept:".item",
        revert:false,
        drop:function(e,ui) {
            if($(ui.draggable).is('#items .item')) {
                var item = $(ui.draggable[0]).attr('item');
                if(manager.items[manager.world_items[item].item].type < 2 || manager.items[manager.world_items[item].item].type > 5) return false;
                $(ui.draggable).remove();

                socket.emit('worlditem_to_inventory', {
                    equip:true,
                    stack: true,
                    item: item,
                    x: ui.offset.left - $character.position().left,
                    y: ui.offset.top - $character.position().top
                });
            }
            if($(ui.draggable).is('#inventory .item')) {

                var item = $(ui.draggable[0]).attr('item');
                console.log(item)
                if(manager.items[manager.inventory.items[item].item].type < 2 || manager.items[manager.inventory.items[item].item].type > 5) return false;
                $(ui.draggable).remove();
                socket.emit('equipment_equip', {
                    item: item
                });
            }
            if($(ui.draggable).is('#bank .item')) {
                var item = $(ui.draggable[0]).attr('item');
                if(manager.items[manager.bank[item].item].type < 2 || manager.items[manager.bank[item].item].type > 5) return false;
                $(ui.draggable).remove();

                socket.emit('bank_to_inventory', {
                    stack: true,
                    item: item,
                    equip:true,
                    x: ui.offset.left - $inventory.position().left,
                    y: ui.offset.top - $inventory.position().top
                });
            }

            //$('#droparea').hide();
        }
    });

    // use attribute points
    $('#stats-points li').bind('click',function() {
        var attribute = $(this).attr('id').split('-')[1];
        console.log(attribute)
        socket.emit('useAttributePoint',{attribute:attribute})
    });

    // shop scrollbar
    // $('#general, #shop .items').jScrollPane();

    // disconnected modal > ok button
    $('#disconnected .modal-actions .ok').bind('click',function() {
        window.location = 'http://www.basjian.com'
    });

    // gm command to double click the map and teleport
    $('#map-image').bind('dblclick',function(e) {
        // todo fix this offset
        var pos = $(this).css('backgroundPosition').replace(/px/g,'').split(' ')
        var x = ((e.offsetX - ($(this).parent().width() / 2))) / 2;
        var y = ((e.offsetY - ($(this).parent().height() / 2)) + 12) / 2;


        var goX = manager.players[manager.me].x+x;
        var goY = manager.players[manager.me].y+y;
        //console.log([x,y].join(', '))
        console.log([goX, goY].join(' '))
        socket.emit('chat', {msg: '/goto ' + goX + ' ' + goY })
    });

});
//     removeWorldItem:function(item, triggeredBy) {
//         $item = $('.item[item="' + item + '"]');
//         if(game.me == triggeredBy) {
//             $('.item').draggable('options','revert',false);
//             $('#droparea').hide();
//         }
//         $item.remove();
//         delete game.world_items[item];
//     },
//     removeWorldNpc:function(npc) {
//         $('#npc_' + npc).remove();
//         delete game.world_npcs[npc]
//     },
//     changeWorldItem:function(data) {
//         game.world_items[data.item].item = data.changeTo;
//         game.dom.items.find('[item="' + data.item + '"]').remove();
//         game.render.items();
//     },
//     removeBankItem:function(item) {
//         $('.item[item="' + item + '"]').remove();
//         $('.item').draggable('options','revert',false);
//         $('#droparea').hide();
//     },
//     kick:function(data) {

//     },
//     mapUpdate:function(data) {

//         console.log(game.map[data.x][data.y])
//         game.map[data.x][data.y] = data.tile;
//         console.log(game.map[data.x][data.y])
//     }

function kick(data) {
    var $kickAlert = showAlert('Kicked', data.reason)
    $kickAlert.find('.alert-ok').die('click').bind('click',function() {
        window.history.go(-1)
    });
}

function showAlert(title, message) {
    $thisAlert = $alert.clone().appendTo('#container');
    $thisAlert.find('.title').text(title);
    $thisAlert.find('.message').html(message)
    $thisAlert.show();
    return $thisAlert
}

function sendChat(msg) {
    if(typeof msg == 'undefined') {
        if($inputWrapper.find('input').val()>'') {
            socket.emit('chat', {msg: $inputWrapper.find('input').val() });
        }
    } else {
        socket.emit('chat', {msg: msg });
    }
}

function handleMovementInput() {
    // var key = key || null;
    // if(typeof manager.players == 'undefined' || typeof manager.players[manager.me] == "undefined" || !connected || manager.playerData.stunned) { return false; }
    // var moved = false;
    // var wasd = false;
    // var requestX = manager.players[manager.me].x;
    // var requestY = manager.players[manager.me].y;
    // var x = 0;
    // var y = 0;

    // // arrow keys
    // if(input.keyboard[38] || key == 38) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; } }; // up
    // if(input.keyboard[40] || key == 40) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; } }; // down
    // if(input.keyboard[37] || key == 37) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; } }; // left
    // if(input.keyboard[39] || key == 39) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; } }; // right
    // // wasd
    // if(input.keyboard[87] || key == 87) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; wasd = true;} };
    // if(input.keyboard[83] || key == 83) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; wasd = true;} };
    // if(input.keyboard[65] || key == 65) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; wasd = true;} };
    // if(input.keyboard[68] || key == 68) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; wasd = true;} };

    // // touch inputs
    // if(input.touch && input.touchEvent.touches.length==settings.touch_move_touch_count) {

    //     if(input.touchX - containerOffsetX < cameraWidth * spriteWidth / 3) {                                      moved = true; x=-1; }
    //     if(input.touchX - containerOffsetX > cameraWidth * spriteWidth / 3 + cameraWidth * spriteWidth / 3) {      moved = true; x=1; }
    //     if(input.touchY - containerOffsetY < cameraHeight * spriteHeight / 3) {                                    moved = true; y=-1; }
    //     if(input.touchY - containerOffsetY > cameraHeight * spriteHeight / 3 + cameraHeight * spriteHeight / 3) {  moved = true; y=1; }
    //     document.title = x + ', ' + y + ',' + input.touchEvent.touches.length
    // }

    // if(moved) {
    //     bank.close();
    //     shop.close();
    //     container.close();
    //     if($(".ui-draggable-dragging").length==0) {
    //         //if((wasd && $("input:focus").length==0) || !wasd) { // arrow keys, or wasd (without being focused on the input field)
    //         if($("input:focus").length==0) { // arrow keys, or wasd (without being focused on the input field)
    //             socket.emit("moveby",{x:x, y:y, input:true})
    //             console.log('move me')
    //         }
    //     }
    // }
}

function toggleWindow() {
    if($(this).is('.active')) {
        $('#' + this.id.replace('icon-','')).hide();
        $(this).removeClass('active')
    } else {
        $('#' + this.id.replace('icon-','')).show();
        $(this).addClass('active')
    }
}

function splitStart(data) {

    $split.data('type', data.type);
    $split.data('item', data.item);
    $split.data('x', data.x);
    $split.data('y', data.y);

    var half = Math.round(data.value / 2);

    // slider max and value
    $('#split .slider').slider('option', 'max', data.value)
    $('#split .slider').slider('option', 'value', half)
    $('#split .max').text(data.value)
    $('#split input[name="split-value"]').val(half)

    $split.show();
    $('#split input').focus()

    // split button actions > Ok
    $('#split .split-ok').unbind('click').bind('click', function() {
        var type = $split.data('type');
        var item = $split.data('item');
        var x = $split.data('x');
        var y = $split.data('y');
        var value = $('#split input[name="split-value"]').val()
        if(value>0) {
            socket.emit('splitconfirm', {value:value, item:item, x:x, y:y, from:data.from, to:$split.data('to')});
        }
    });

    $('#split .split-cancel').unbind('click').bind('click', function() {
        render.inventory();
        render.bank();
        $split.hide();
    });
}

function splitComplete() {
    $split.data('type', null);
    $split.data('item', null);
    $split.data('x', null);
    $split.data('y', null);

    $split.hide();
}

function addLog(str) {
    // if(typeof str == 'object') { str = str.msg }
    // var $newLine = $('<p>' + str + '</p>');
    // $chat.find('.jspPane').append($newLine);
    // var api = $chat.data('jsp');
    // if($chat.find('p').length>50) {
    //     $chat.find('p:lt(40)').remove();
    // }
    // api.reinitialise()
    // api.scrollToBottom();
}

function addCombatLog(str) {
    if(typeof str == 'object') { str = str.msg }
    var $newLine = $('<li>' + str + '</li>');
    $combatlog.find('ul').append($newLine);
    if($combatlog.find('li').length > 4) {
         $combatlog.find('li:lt(1)').remove();
    }
}
function centerContainer() {
    containerOffsetX = $(window).width() / 2 - $('#container').width()/2;
    containerOffsetY = $(window).height() / 2 - $('#container').height()/2;
    $('#container, #login').css({
        left:containerOffsetX,
        top:containerOffsetY
    })
}

function toggleTargetProtection() {
    if(manager.targetProtection) {
        manager.targetProtection = false;
        addLog('Target protection <span class="disabled">disabled</span>')
    } else {
        manager.targetProtection = true;
        addLog('Target protection <span class="enabled">enabled</span>')
    }
}