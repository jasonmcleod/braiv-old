guild = {
    edit:function(data) {
        console.log(arguments)
        $('.edit_guild').remove();


        var membersHTML = '<ul>';
        for(var p in data.members) {
            membersHTML+= [
                '<li member="' + p + '">',
                    '<span>' + data.members[p].name + '</span>',
                    p==game.me ? '':'<span class="guildRemove">X</span>',
                '</li>'
            ].join('');
        }
        membersHTML+='</ul>';

        $deed = $([
            '<div class="edit_guild modal border">',
            '<div class="title">Guild Deed</div>',
            '   <div class="close-modal">x</div>',
            '   <table width="100%">',
            '       <tr>',
            '           <td width="30%" class="label">Name</td>',
            '           <td width="70%"><input name="guildName" maxlength="60" value="' + data.data.name + '"></td>',
            '       </tr>',
            '       <tr>',
            '           <td class="label">Tag</td>',
            '           <td><input name="guildTag" maxlength="4" value="' + data.data.tag + '"></td>',
            '       </tr>',
            '       <tr>',
            '           <td valign="top" class="label">Members</td>',
            '           <td><div id="guildMembers">' + membersHTML + '</div></td>',
            '       </tr>',
            '       <tr>',
            '           <td class="label">Add Member</td>',
            '           <td><div class="use-with"></div>Drag and drop the target onto a player.</td>',
            '       </tr>',
            '       <tr>',
            '           <td><input type="button" action="cancel" value="Cancel"></td>',
            '           <td><input type="button" action="save" value="Save"></td>',
            '       </tr>',
            '   </table>',
            '</div>'
        ].join(''));

        $deed.draggable({handle:'.title', stack:'.dialog, .modal'});

        $('body').append($deed);

        $deed.find('#guildMembers').jScrollPane();
        $deed.find('.use-with').draggable({
            start:function() {
                $('.player:not("#viewport-me")').droppable({
                    accepts:'.use-with',
                    drop:function(e,ui) {
                        console.log($(this).attr('index'))
                        game.socket.emit('guild_add',{member:$(this).attr('index')})
                    }
                });
            },
            revert:true
        });
        game.ui.guild.init();

    },
    refresh:function(data) {
        if($('.edit_guild').length>0) {
            console.log(data)
            var membersHTML = '<ul>';

            if(data.hasOwnProperty('tag')) {
                $deed.find('input[name="guildTag"]').val(data.tag)
            }

            if(data.hasOwnProperty('name')) {
                $deed.find('input[name="guildName"]').val(data.name)
            }


            if(data.hasOwnProperty('members')) {
                for(var p in data.members) {
                    membersHTML+= [
                        '<li member="' + p + '">',
                            '<span>' + data.members[p].name + '</span>',
                            p==game.me ? '':'<span class="guildRemove">X</span>',
                        '</li>'
                    ].join('');
                }
                membersHTML+='</ul>';

                $('#guildMembers .jspPane').html(membersHTML)
                $('#guildMembers').data('jsp').reinitialise()

                game.ui.guild.init();
            }
        }
    },
    init:function() {
        $deed.find('input[action="cancel"], .close-modal').bind('click',function() {
            $('.edit_guild').remove();
        });

        $deed.find('.guildRemove').bind('click',function() {
            var $confirm = $([
                '<div class="confirm">',
                'Are you sure you want to remove ' + $(this).parents('li:first').find('span:first').text() + ' from the guild?',
                '</div>'
            ].join(''));

            $('body').append($confirm);
            var member = $(this).parents('li:first').attr('member')

            $(this).parents('li:first').attr('member')
            $confirm.dialog({
                title:'Confirm remove',
                modal:true,
                buttons:{
                    'Yes':function() {
                        game.socket.emit('guild_remove', {guild: game.players[game.me].guild, member: member})
                        $confirm.dialog('close');
                    },
                    'Cancel':function() {
                        $confirm.dialog('close');
                    }
                }
            })
        });

        $deed.find('input[action="save"]').bind('click',function() {
            console.log('save')
            game.socket.emit('guild_update', {name:$deed.find('input[name="guildName"]').val(), tag:$deed.find('input[name="guildTag"]').val()})
        });
    }
}