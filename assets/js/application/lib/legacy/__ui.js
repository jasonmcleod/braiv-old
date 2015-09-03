$(function() {

    $('.slider').slider().removeClass('ui-corner-all').find('.ui-slider-handle').removeClass('ui-corner-all');
    $('.slider').bind('slide',function(e, ui) {
        var value = ui.value;
        $('#split input').val(value)
    });
    $('#split input[name="split-value"]').bind('keyup', function() {
        console.log('press')
        $('#split .slider').slider('option', 'value', $(this).val())
    })

    // draggable boxes
    $('#map, #character, #inventory, #bank').draggable({
        snap:'.box, #topbar, #viewport, #container',
    });

    // draggable boxes iOS support
    $('.box').each(function() {
        this.ontouchstart = touchToMouse;
        this.ontouchmove = touchToMouse;
        this.ontouchend = touchToMouse;
    });

    $chat.single_double_click(function(e) {
        if(e.button==2) {
            $('#chat, #chat ul').css({height:546});
            clearTimeout(chatFade)
        }
    }).mouseup(function() {
        $('#chat, #chat ul').css({height:96});
        chatFade = setTimeout(function() {
            $chat.fadeOut();
        },5000)
    });

    // dragging items
    $inventory.find('.item').live('mouseover', bindInventoryMouseEvents);
    $items.find('.item').live('mouseover', bindWorldItemMouseEvents);
    $character.find('.item').live('mouseover', bindEquipmentMouseEvents);
    $bank.find('.item').live('mouseover', bindBankMouseEvents);

    $viewportElements.find('.npc').live('mouseover', bindNpcMouseEvents);

    // clicking on icons toggles their windows
    $('#icon-inventory, #icon-character, #icon-map, #icon-chat, #icon-quest').bind('click', toggleWindow).bind('touchstart',toggleWindow);

    // key bindings
    $(document).bind('keydown', keyBindings);

    // clicking on attribute points
    $('#stats-points li').live('click', useAttributePoint)

    // clicking/double clicking on viewport
    $('#viewport').single_double_click(singleClickViewport, doubleClickViewport)
});

function splitStart(data) {

    $('#split').data('type', data.type);
    $('#split').data('item', data.item);
    $('#split').data('x', data.x);
    $('#split').data('y', data.y);

    var half = Math.round(data.value / 2);

    // slider max and value
    $('#split .slider').slider('option', 'max', data.value)
    $('#split .slider').slider('option', 'value', half)
    $('#split .max').text(data.value)
    $('#split input[name="split-value"]').val(half)
    $('#split').show();
    $('#split input').focus();


    // split button actions > Ok
    $('#split .split-ok').unbind('click').bind('click', function() {
        var type = $('#split').data('type');
        var item = $('#split').data('item');
        var x = $('#split').data('x');
        var y = $('#split').data('y');
        var value = $('#split input[name="split-value"]').val()
        if(value>0) {
            socket.emit('splitconfirm', {value:value, item:item, x:x, y:y, from:data.from, to:data.to});
        }
    });

        // split button actions > Ok
    $('#split .split-cancel').unbind('click').bind('click', function() {
        $('#split').hide();
    });

    console.log(data)
}

function splitComplete() {
    $('#split input').blur()
    $('#split').hide();
}

function bindInventoryMouseEvents() {
    $('.ui-droppable').droppable('destroy');

    $(this).single_double_click(function(e) {
        if($(this).data('dragging')) return false;
        var item = $(this).attr('item');
        if(e.altKey && manager.players[game.me].gm==1) {
            socket.emit('edit_item', {item:$(this).attr('itemtype')})
        } else {
            socket.emit('inventory_identify', {item:item})
        }
    },function(e) {
        var item = $(this).attr('item');
        socket.emit('inventory_use', {item:item})
    })

    $(this).draggable({
        grid:[2, 2],
        revert:true,
        zIndex:1000,
        //cursorAt:{left:spriteWidth/2, top:spriteHeight/2},
        start:function(e) {
            $droparea.show();
            $(this).data('dragging',true)
            $(this).data('from','inventory')

        },
        stop:function(e, ui) {
            console.log(ui)
            $droparea.hide();
            var item = $(ui.helper[0]).attr('item');
            var from = $(ui.helper[0]).data('from');
            if(e.shiftKey) {
                console.log('shift');
                socket.emit('splitstart', {
                    from:from,
                    to:'inventory',
                    item: item,
                    equip:false,
                    x: ui.offset.left - $('#inventory').offset().left,
                    y: ui.offset.top - $('#inventory').offset().top
                });                
            }
            $(this).draggable('option','revert',true)

            // clear dragging flag - this allows single click identify without identifying during a drag event
            setTimeout(function(which) {
                $(which).data('dragging',false)
            },500,this)
        }
    });

    $droparea.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            var dropX = ui.offset.left - $(this).offset().left + spriteWidth/2
            var dropY = ui.offset.top - $(this).offset().top + spriteHeight/2
            var tileX = dropX <= spriteWidth ? -1:dropX >= spriteWidth*2 ? 1:0;
            var tileY = dropY <= spriteHeight ? -1:dropY >= spriteHeight*2 ? 1:0;

            if(!$item.is('.soulbound')) {
                $droparea.hide();
                $item.remove();
            }

            socket.emit('inventory_drop', {item:item, x:tileX, y: tileY})

        }
    });

    $inventory.droppable({
        drop:function(e, ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');
            var x = ui.offset.left - $inventory.offset().left;
            var y = ui.offset.top - $inventory.offset().top;
            $item.draggable('option','revert',false)
            socket.emit('inventory_move',{item:item, x:x, y:y})
        }
    });

    $bank.droppable({
        drop:function(e, ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');
            var x = ui.offset.left - $bank.offset().left - spriteWidth/2;
            var y = ui.offset.top - $bank.offset().top - spriteHeight/2;
            console.log('top: ' + ui.offset.top)
            $item.draggable('option','revert',false)
            //socket.emit('bank_move',{item:item, x:x, y:y})
            console.log('inv to bank')
            socket.emit('inventory_to_bank', {
                item: item,
                x: x,
                y: y
            });
        }
    })


    $inventory.find('.item[itemtype="' + $(this).attr('itemtype') + '"]').droppable({
        greedy:true,
        drop:function(e,ui) {
            var drag = $(ui.draggable).attr('item')
            var drop = $(this).attr('item');
            $(ui.draggable).remove()
            socket.emit('inventory_stack',{drag:drag ,drop:drop, to:'inventory'})
            $droparea.hide();
        }
    })

    $character.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');
            if(manager.items[manager.inventory.items[item].item].type < 2 || manager.items[manager.inventory.items[item].item].type > 5) return false;
            $item.remove();
            $droparea.hide();
            socket.emit('equipment_equip', {
                item: item
            });

        }
    })
}

function bindBankMouseEvents() {
    $('.ui-droppable').droppable('destroy');

    $(this).single_double_click(function(e) {
        if($(this).data('dragging')) return false;
        var item = $(this).attr('item');
        if(e.altKey && manager.players[game.me].gm==1) {
            socket.emit('edit_item', {item:$(this).attr('itemtype')})
        } else {
            socket.emit('bank_identify', {item:item})
        }
    },function(e) {
        var item = $(this).attr('item');
        socket.emit('bank_use', {item:item})
    })

    $(this).draggable({
        grid:[2, 2],
        revert:true,
        zIndex:1000,
        //cursorAt:{left:spriteWidth/2, top:spriteHeight/2},
        start:function() {
            $droparea.show();
            $(this).data('dragging',true)
            $(this).data('from', 'bank')
        },
        stop:function(e, ui) {
            $droparea.hide();

            var item = $(ui.helper[0]).attr('item');
            var from = $(ui.helper[0]).data('from');

            if(e.shiftKey) {
                console.log('shift');
                socket.emit('splitstart', {
                    from:from,
                    to:'bank',
                    item: item,
                    equip:false,
                    x: ui.offset.left - $('#bank').offset().left,
                    y: ui.offset.top - $('#bank').offset().top
                });                
            }

            // clear dragging flag - this allows single click identify without identifying during a drag event
            setTimeout(function(which) {
                $(which).data('dragging',false)
            },500,this)
        }
    });

    $droparea.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            var dropX = ui.offset.left - $(this).offset().left + spriteWidth/2
            var dropY = ui.offset.top - $(this).offset().top + spriteHeight/2
            var tileX = dropX <= spriteWidth ? -1:dropX >= spriteWidth*2 ? 1:0;
            var tileY = dropY <= spriteHeight ? -1:dropY >= spriteHeight*2 ? 1:0;

            if(!$item.is('.soulbound')) {
                $droparea.hide();
                $item.remove();
            }

            console.log('bank drop')
            socket.emit('bank_drop', {item:item, x:tileX, y: tileY})

        }
    });

    $bank.droppable({
        drop:function(e, ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');
            var x = ui.offset.left - $bank.offset().left;
            var y = ui.offset.top - $bank.offset().top;
            $item.draggable('option','revert',false);
            console.log('bank move')
            socket.emit('bank_move',{item:item, x:x, y:y})
        }
    });

    $inventory.droppable({
        drop:function(e, ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');
            var x = ui.offset.left - $inventory.offset().left - spriteWidth/2;
            var y = ui.offset.top - $inventory.offset().top - spriteHeight/2;
            console.log('top: ' + ui.offset.top)
            $item.draggable('option','revert',false)
            //socket.emit('bank_move',{item:item, x:x, y:y})
            console.log('bank to inv')
            socket.emit('bank_to_inventory', {
                item: item,
                x: x,
                y: y
            });
        }
    })


    $bank.find('.item[itemtype="' + $(this).attr('itemtype') + '"]').droppable({
        greedy:true,
        drop:function(e,ui) {
            var drag = $(ui.draggable).attr('item')
            var drop = $(this).attr('item');
            $(ui.draggable).remove()
            $droparea.hide();
            socket.emit('bank_stack',{drag:drag ,drop:drop, to:'bank'})
        }
    })

    // $character.droppable({
    //     drop:function(e,ui) {
    //         var $item = $(ui.draggable);
    //         var item = $item.attr('item');
    //         if(manager.items[manager.inventory.items[item].item].type < 2 || manager.items[manager.inventory.items[item].item].type > 5) return false;
    //         $item.remove();
    //         $droparea.hide();
    //         socket.emit('equipment_equip', {
    //             item: item
    //         });
    //
    //     }
    // })
}

function bindWorldItemMouseEvents() {
    $('.ui-droppable').droppable('destroy');

    $(this).draggable({
        grid:[2, 2],
        revert:true,
        zIndex:1000,
        cursorAt:{left:spriteWidth/2, top:spriteHeight/2},
        start:function() {
            var boundTop = (cameraHeight/2-2) * spriteHeight;
            var boundBottom = (cameraHeight/2+1) * spriteHeight;
            var boundLeft = (cameraWidth/2-2) * spriteWidth;
            var boundRight = (cameraWidth/2+1) * spriteWidth;
            var y = $(this).position().top;
            var x = $(this).position().left

            if(y < boundTop || y > boundBottom || x < boundLeft || x > boundRight) {
                return false;
            }

            $droparea.show();
        },
        stop:function() {
            delete manager.world_items[$(this).attr('item')]
            $(this).remove();
            $droparea.hide();
        }
    });

    $inventory.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            $item.remove();
            $droparea.hide();
            socket.emit('worlditem_to_inventory', {
                stack: true,
                item: item,
                equip:false,
                x:ui.offset.left - $inventory.offset().left - spriteWidth/2,
                y:ui.offset.top - $inventory.offset().top - spriteHeight/2
            });
        }
    });

    $bank.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            $item.remove();
            $droparea.hide();
            socket.emit('worlditem_to_bank', {
                stack: true,
                item: item,
                equip:false,
                x:ui.offset.left - $bank.offset().left - spriteWidth/2,
                y:ui.offset.top - $bank.offset().top - spriteHeight/2
            });
        }
    })

    $me.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            $item.remove();
            $droparea.hide();
            socket.emit('worlditem_to_inventory', {
                stack: true,
                item: item,
                equip:false,
                x: randomRange(10,$inventory.width() - 10),
                y: randomRange(40,$inventory.height() - 60)
            });
        }
    });


    $droparea.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            var dropX = ui.offset.left - $(this).offset().left + spriteWidth/2
            var dropY = ui.offset.top - $(this).offset().top + spriteHeight/2
            var tileX = dropX <= spriteWidth ? -1:dropX >= spriteWidth*2 ? 1:0;
            var tileY = dropY <= spriteHeight ? -1:dropY >= spriteHeight*2 ? 1:0;

            if(!$item.is('.soulbound')) {
                $droparea.hide();
                $item.remove();
            }

            socket.emit('worlditem_move', {item:item, x:tileX, y: tileY})

        }
    });

}

function bindEquipmentMouseEvents() {
    $('.ui-droppable').droppable('destroy');

    $(this).single_double_click(function(e) {
        if($(this).data('dragging')) return false;
        var item = $(this).attr('item');
        if(e.altKey && manager.players[game.me].gm==1) {
            socket.emit('edit_item', {item:$(this).attr('itemtype')})
        } else {
            socket.emit('equipment_identify', {item:item})
        }
    },function(e) {
        var item = $(this).attr('item');
        console.log('unequip ' + item)
        socket.emit('equipment_unequip', {item:item})
    })

    $(this).draggable({
        grid:[2, 2],
        revert:true,
        zIndex:1000,
        cursorAt:{left:spriteWidth/2, top:spriteHeight/2},
        start:function() {
            $(this).data('dragging',true)
        },
        stop:function() {
            $droparea.hide();

            // clear dragging flag - this allows single click identify without identifying during a drag event
            setTimeout(function(which) {
                $(which).data('dragging',false)
            },500,this)
        }
    });

    $inventory.droppable({
        drop:function(e,ui) {
            var $item = $(ui.draggable);
            var item = $item.attr('item');

            $item.remove();
            $droparea.hide();
            socket.emit('equipment_unequip', {
                item: item,
                x:ui.offset.left - $inventory.offset().left - spriteWidth/2,
                y:ui.offset.top - $inventory.offset().top - spriteHeight/2
            });
        }
    })

}

function bindNpcMouseEvents(e) {
    if(e.shiftKey) {
        socket.emit('target', {id:$(this).attr('index'), type:TYPE_NPC});
    }
}


function toggleChatInput() {
    $inputWrapper = $('#chat-input')
    if($inputWrapper.find('input').is(':focus')) {
        if($inputWrapper.find('input').val()>'') {
            socket.emit('chat', {msg: $inputWrapper.find('input').val() });
        }
        $inputWrapper.find('input').val('').blur();
        $inputWrapper.hide();
    } else {
        $inputWrapper.show()
        $inputWrapper.find('input').focus();
    }
    $('#chat').show();
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

function addLog(data) {
    var $newLine = $('<li>' + data.msg + '</li>');
    $newLine.css({bottom:0})
    $chat.find('li').each(function() {
        $(this).css({bottom:'+=24px'});
    })
    $chat.find('ul').append($newLine);
    $chat.show();
    clearTimeout(chatFade)
    chatFade = setTimeout(function($line) {
        $chat.stop().fadeOut();
    },5000,$newLine)

}

function centerContainer() {
    containerOffsetX = $(window).width() / 2 - $('#container').width()/2;
    containerOffsetY = $(window).height() / 2 - $('#container').height()/2;
    $('#container').css({
        left:containerOffsetX,
        top:containerOffsetY
    })
}

function handleMovementInput() {
    var key = key || null;
    if(typeof manager.players == 'undefined' || typeof manager.players[manager.me] == "undefined" || !connected || manager.playerData.stunned) { return false; }
    var moved = false;
    var wasd = false;
    var requestX = manager.players[manager.me].x;
    var requestY = manager.players[manager.me].y;
    var x = 0;
    var y = 0;

    // arrow keys
    if(input.keyboard[38] || key == 38) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; } }; // up
    if(input.keyboard[40] || key == 40) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; } }; // down
    if(input.keyboard[37] || key == 37) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; } }; // left
    if(input.keyboard[39] || key == 39) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; } }; // right
    // wasd
    if(input.keyboard[87] || key == 87) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y-1)) { y =-1; moved = true; wasd = true;} };
    if(input.keyboard[83] || key == 83) { if(manager.canWalkOnTile(manager.players[manager.me].x,  manager.players[manager.me].y+1)) { y = 1; moved = true; wasd = true;} };
    if(input.keyboard[65] || key == 65) { if(manager.canWalkOnTile(manager.players[manager.me].x-1,manager.players[manager.me].y)) {   x =-1; moved = true; wasd = true;} };
    if(input.keyboard[68] || key == 68) { if(manager.canWalkOnTile(manager.players[manager.me].x+1,manager.players[manager.me].y)) {   x = 1; moved = true; wasd = true;} };

    // touch inputs
    if(input.touch && input.touchEvent.touches.length==settings.touch_move_touch_count) {

        if(input.touchX - containerOffsetX < cameraWidth * spriteWidth / 3) {                                      moved = true; x=-1; }
        if(input.touchX - containerOffsetX > cameraWidth * spriteWidth / 3 + cameraWidth * spriteWidth / 3) {      moved = true; x=1; }
        if(input.touchY - containerOffsetY < cameraHeight * spriteHeight / 3) {                                    moved = true; y=-1; }
        if(input.touchY - containerOffsetY > cameraHeight * spriteHeight / 3 + cameraHeight * spriteHeight / 3) {  moved = true; y=1; }
        document.title = x + ', ' + y + ',' + input.touchEvent.touches.length
    }

    if(moved) {
        //bank.close();
        //shop.close();
        //container.close();
        if($(".ui-draggable-dragging").length==0) {
            if((wasd && $("input:focus").length==0) || !wasd) { // arrow keys, or wasd (without being focused on the input field)
                socket.emit("moveby",{x:x, y:y, input:true})
            }
        }
    }
}
function keyBindings(e) {
    switch(e.keyCode) {

        case 8: // backspace
            if($('input:focus').length<=0) {
                return false;
            }
            break;
            
        case 13:  // enter
            if($('#split').is(':visible')) {
                $('#split .split-ok').click();
            } else {
                toggleChatInput(); 
            }
            break;

        default: break;
    }
}

function singleClickViewport(e) {
    var tileX = Math.round(((e.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
    var tileY = Math.round(((e.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
    var mapX = tileX + cameraX;
    var mapY = tileY + cameraY;
    var target = e.button==2;
    console.log(target)
    socket.emit('identify',{target:target, x:mapX, y:mapY});
}

function doubleClickViewport(e) {
    e.preventDefault();
    var tileX = Math.round(((e.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
    var tileY = Math.round(((e.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
    var mapX = tileX + cameraX;
    var mapY = tileY + cameraY;
    socket.emit('useonmap',{x: mapX, y: mapY});
}

function useAttributePoint() {
    var attribute = $(this).attr('id').split('-')[1];
    console.log(attribute)
    socket.emit('useAttributePoint',{attribute:attribute})
}