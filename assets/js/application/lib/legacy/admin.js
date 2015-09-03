$(function() {

    // debug info when moving mouse
    $viewport.bind('mousemove',function(e) {
        if(!manager.me || $.isEmptyObject(manager.players)) return;

        var tileX = Math.round(((e.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
        var tileY = Math.round(((e.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);

        $('#debug #cords').html('Cursor position: ' + (cameraX + tileX) + ', ' + (cameraY + tileY) + '<br> (Camera: ' + tileX + ', ' + tileY + '), Tile: ' + map[(cameraY + tileY) * 1000 + (cameraX + tileX)]);
    });

    // $('#editors .button').bind('click', function() {
    //     $(this).toggleClass('active')
    //     if($(this).is('.active')) {
    //         tools[$(this).attr('tool')].activate();

    //     } else {
    //         tools[$(this).attr('tool')].deactivate();
    //     }
    // });

});

// tools.fixtures = {
//     activate:function() {
//         editingFixtures = true;

//         $('#fixture-editor').show().draggable({handle:'.title', snap:boxSnapSelectors});

//         $('#viewport-elements .fixture').live('mouseover',function() {
//             $(this).draggable({
//                 grid:[32,32],
//                 revert:false,
//                 stop:function(e,ui) {
//                     var newX = parseInt((ui.position.left / spriteWidth) + cameraX);
//                     var newY = parseInt((ui.position.top / spriteHeight) + cameraY);
//                     console.log(newX + ', ' + newY)
//                     socket.emit('world_fixture_move',{id: $(this).attr('index'), x:newX, y:newY})
//                 }
//             })
//         });

//         var paletteHTML = '';
//         for(var f in manager.fixtures) {
//             if(f>0) {
//                 var y = (manager.fixtures[f].id-1) * spriteHeight * -1;
//                 paletteHTML+='<div index="' + manager.fixtures[f].id + '" name="' + manager.fixtures[f].name + '" class="fixture element" style="background:url(' + paths.fixtures + ') 0px ' + y + 'px"></div>';
//             }
//         }

//         $('#fixture-palette').html(paletteHTML);
//         $('#fixture-palette .element').draggable({
//             revert:true,
//             stop:function(e, ui) {

//                 var tileX = cameraX + Math.round(((e.originalEvent.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
//                 var tileY = cameraY + Math.round(((e.originalEvent.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
//                 var fixture = $(this).attr('index')
//                 console.log(fixture)
//                 socket.emit('world_fixture_insert', {fixture: fixture, x:tileX, y:tileY, map:manager.activeMap})
//             }
//         });

//         $('#fixture-editor .delete').droppable({
//             accepts:$('#viewport-elements .fixture'),
//             drop:function(e, ui) {
//                 socket.emit('world_fixture_delete', {fixture:$(ui.draggable).attr('index')})
//                 $(ui.draggable).remove();
//                 return false;
//             }
//         })

//         $('#viewport-elements .fixture').live('click', function() {

//             $.ajax({
//                 type:'GET',
//                 url:'/world_fixture/details',
//                 data:{index:$(this).attr('index')},
//                 success:function(data) {
//                     if($('#fixture-details .jspPane').length>0) {
//                         $('#fixture-details').data('jsp').destroy();
//                     }
//                     var rows = ''
//                     for(var field in data) {
//                         rows+= [
//                             '<tr>',
//                             '    <td width="30%">' + field + '</td>',
//                             '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
//                             '</tr>'
//                         ].join('');
//                     }

//                     $('#fixture-details').html('<form><table>' + rows + '</table></form>');                    
//                     $('#fixture-details').jScrollPane();
//                 }
//             });


//             $('[action="fixture-save"]').unbind('click').bind('click', function() {
//                 console.log('world_fixture_update')
//                 socket.emit('world_fixture_update',$('#fixture-details form').serializeArray())
//             });

//         });


//         $('#fixture-palette .fixture').unbind('click').bind('click', function() {

//             $.ajax({
//                 type:'GET',
//                 url:'/fixture/details',
//                 data:{index:$(this).attr('index')},
//                 success:function(data) {
//                     if($('#fixture-details .jspPane').length>0) {
//                         $('#fixture-details').data('jsp').destroy();
//                     }
//                     var rows = ''
//                     for(var field in data) {
//                         rows+= [
//                             '<tr>',
//                             '    <td width="30%">' + field + '</td>',
//                             '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
//                             '</tr>'
//                         ].join('');
//                     }

//                     $('#fixture-details').html('<form><table>' + rows + '</table></form>');                    
//                     $('#fixture-details').jScrollPane();
//                 }
//             });

//             $('[action="fixture-save"]').unbind('click').bind('click', function() {
//                 console.log('fixture_update')                
//                 socket.emit('fixture_update',$('#fixture-details form').serializeArray())
//             });        

//         });

        
//     },
//     deactivate:function() {
//         $('#fixture-editor').hide();
//         editingFixtures = false;
//     }
// }

tools.npcs = {
    activate:function() {
        editingNPCs = true;

        $('#npc-editor').show().draggable({handle:'.title', snap:boxSnapSelectors});

        $('#viewport-elements .npc').live('mouseover',function(e) {
            $(this).draggable({
                grid:[32,32],
                revert:false,
                zIndex:1000,
                stop:function(e,ui) {
                    var newX = parseInt((ui.position.left / spriteWidth) + cameraX);
                    var newY = parseInt((ui.position.top / spriteHeight) + cameraY);
                    console.log(newX + ', ' + newY)
                    socket.emit('world_npc_move',{id: $(this).attr('index'), x:newX, y:newY})
                }
            })
        });

        var paletteHTML = '';
        for(var n in manager.npcs) {
            var y = n * spriteHeight * -1;
            paletteHTML+='<div index="' + manager.npcs[n].id + '" class="npc element" style="background:url(' + paths.npcs + manager.npcs[n].sprite + '.png) 0px ' + y + 'px"></div>';
        }

        $('#npc-palette').html(paletteHTML);
        $('#npc-palette .npc').draggable({
            revert:true,
            stop:function(e, ui) {

                var tileX = cameraX + Math.round(((e.originalEvent.pageX - $viewport.offset().left) - spriteWidth / 2) / spriteWidth);
                var tileY = cameraY + Math.round(((e.originalEvent.pageY - $viewport.offset().top) - spriteHeight / 2) / spriteHeight);
                var npc = $(this).attr('index')
                socket.emit('world_npc_insert', {npc: npc, x:tileX, y:tileY, map:manager.activeMap})
            }
        });

        $('#npc-editor .delete').droppable({
            accepts:$('#viewport-elements .npc'),
            drop:function(e, ui) {
                socket.emit('world_npc_delete', {npc:$(ui.draggable).attr('index')})
                $(ui.draggable).remove();
                return false;
            }
        })

        $('#viewport-elements .npc').unbind('click').bind('click', function() {

            $.ajax({
                type:'GET',
                url:'/world_npc/details',
                data:{index:$(this).attr('index')},
                success:function(data) {
                    if($('#npc-details .jspPane').length>0) {
                        $('#npc-details').data('jsp').destroy();
                    }

                    var rows = ''
                    for(var field in data) {
                        rows+= [
                        '<tr>',
                        '    <td width="30%">' + field + '</td>',
                        '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
                        '</tr>'
                        ].join('');
                    }

                    $('#npc-details').html('<form><table>' + rows + '</table></form>');
                    $('#npc-details').jScrollPane();
                }
            });

            $('[action="npc-save"]').unbind('click').bind('click', function() {
                console.log('world_npc save')                
                socket.emit('world_npc_update',$('#npc-details form').serializeArray())
            })
        });

        $('#npc-palette .npc').unbind('click').bind('click', function() {

            $.ajax({
                type:'GET',
                url:'/npc/details',
                data:{index:$(this).attr('index')},
                success:function(data) {
                    if($('#npc-details .jspPane').length>0) {
                        $('#npc-details').data('jsp').destroy();
                    }

                    var rows = ''
                    for(var field in data) {
                        rows+= [
                        '<tr>',
                        '    <td width="30%">' + field + '</td>',
                        '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
                        '</tr>'
                        ].join('');
                    }

                    $('#npc-details').html('<form><table>' + rows + '</table></form>');
                    $('#npc-details').jScrollPane();
                }
            });

            $('[action="npc-save"]').unbind('click').bind('click', function() {
                console.log('npc save')
                socket.emit('npc_update',$('#npc-details form').serializeArray())
            })
        });

    },
    deactivate:function() {
        $('#npc-editor').hide();
        editingNPCs = false;
    }
}

tools.items = {
    activate:function() {

        $('#item-editor').show().draggable({handle:'.title', snap:boxSnapSelectors});

        var paletteHTML = '';
        for(var i in manager.items) {
            paletteHTML+='<div index="' + manager.items[i].id + '" class="item element" style="background:url(' + paths.items + manager.items[i].sprite + '.gif)"></div>';
        }

        $('#item-palette').html(paletteHTML);
        $('#item-palette').jScrollPane();

        $('#item-palette .item').unbind('click').live('click', function() {

            $.ajax({
                type:'GET',
                url:'/item/details',
                data:{item:$(this).attr('index')},
                success:function(data) {
                    if($('#item-details .jspPane').length>0) {
                        $('#item-details').data('jsp').destroy();
                    }

                    var rows = ''
                    for(var field in data) {
                        if(field!='img') {
                            rows+= [
                                '<tr>',
                                '    <td width="30%">' + field + '</td>',
                                '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
                                '</tr>'
                            ].join('');
                        }
                    }

                    $('#item-details').html('<form><table>' + rows + '</table></form>');
                    $('#item-details').jScrollPane();
                }
            });


        });


        $('#inventory .item, #bank .item, #character .item, #shop .item').unbind('click').live('click', function() {
            console.log('.item click')
            $.ajax({
                type:'GET',
                url:'/item/details',
                data:{item:$(this).attr('itemtype')},
                success:function(data) {
                    if($('#item-details .jspPane').length>0) {
                        $('#item-details').data('jsp').destroy();
                    }

                    var rows = ''
                    for(var field in data) {
                        if(field!='img') {
                            rows+= [
                                '<tr>',
                                '    <td width="30%">' + field + '</td>',
                                '    <td width="70%"><input type="text" name="' + field + '" value=\'' + (typeof data[field] == 'object' ? JSON.stringify(data[field]) : data[field]) + '\'></div>',
                                '</tr>'
                            ].join('');
                        }
                    }

                    $('#item-details').html('<form><table>' + rows + '</table></form>');
                    $('#item-details').jScrollPane();
                }
            });


        });

        $('[action="item-save"]').unbind('cilck').bind('click', function() {
            socket.emit('item_update',$('#item-details form').serializeArray())
        })
    },
    deactivate:function() {
        $('#item-editor').hide();
    }
}