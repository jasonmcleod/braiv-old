$(function() {

    // $('#login-form').fadeTo(0,0).delay(1000).fadeTo(4000,1);
    $('input[name="login"]').focus();

    var audioReady = function(){
        if (audio.intro.readyState) {
            audio.intro.volume=0;
            audio.intro.loop=true;
            // if(settings.audio) audio.intro.play();
            // var fadeAudioIn = setInterval(function() {
            //     audio.intro.volume+=.1;
            //     if(audio.intro.volume>.9) clearInterval(fadeAudioIn)
            // },500);
        } else {
            setTimeout(audioReady, 250);
        }
    }
    audioReady();

    // $('#login-button').bind('click', function() {
    //     $.ajax({
    //       type: 'POST',
    //       url: '/logon',
    //       data: {username:$('input[name="login"]').val(), password:$('input[name="password"]').val()},
    //       success: function(data) {
    //           if(data.success) {
    //               authtoken = data.authtoken
    //               $('#login-form').stop().fadeOut(200);
    //               $('#characters, #enter-world').show().fadeTo(0,0).fadeTo(200,1);
    //               $.get('/characters?token=' + authtoken, function(data) {
    //                   $('#characters').html('')
    //                   for(var c in data) {
    //                       $('#characters').append('<div class="character" character="' + data[c].id + '"><div class="sprite"></div>' + data[c].name + ', level ' + data[c].level + ' warrior</div>')
    //                   }
    //                   for(var n=0; n < 4-data.length;n++) {
    //                       $('#characters').append('<div class="character empty" character="0"><div class="sprite"></div>Create a new character</div>')
    //                   }

    //                   $('#characters .character:first').addClass('selected')
    //               });
    //           } else {
    //               $('#login .error').text('Incorrect Login/Password');
    //           }
    //       },
    //       dataType: 'json'
    //     });
    // });

    $('input[name="login"], input[name="password"]').bind('keypress',function(e) {
        if(e.keyCode==13) {
            $('#login-button').click();
        }
    })

    $('.character').bind('click', function() {
        $('.character').removeClass('selected')
        $(this).addClass('selected')
        console.log($(this).attr('character'))
    });

    // $('#enter-world').bind('click',function() {
    //     var c = $('.character.selected').attr('character')
    //     if(c!="0") {
    //         connect(c);
    //     }
    // })

    $('.character.empty').bind('click', function() {
        $('#characters').html([
            '<table width="100%">',
            '   <tr>',
            '       <td valign="top" width="25%">Name:</td>',
            '       <td><input name="new-character-name" maxlength="16"><span class="new-character-name-status"></span></td>',
            '   </tr>',
            '   <tr>',
            '       <td>Class:</td>',
            '       <td><div class="sprite selected"></div></td>',
            '   </tr>',
            '   <tr>',
            '       <td valign="top">Stats:<br>Pool: <span class="new-character-pool">0</span></td>',
            '       <td>',
            '           <table width="100%" class="new-character-stats">',
            '               <tr>',
            '                   <td>STR:</td>',
            '                   <td><table width="80%"><tr><td><a class="button down">-</a></td><td align="center"><span class="new-character-str">5</span><td align="right"><a class="button up">+</a></td></td></tr></table>',
            '                   <td>DEX:</td>',
            '                   <td><table width="80%"><tr><td><a class="button down">-</a></td><td align="center"><span class="new-character-dex">5</span><td align="right"><a class="button up">+</a></td></td></tr></table>',
            '               </tr>',
            '               <tr>',
            '                   <td>INT:</td>',
            '                   <td><table width="80%"><tr><td><a class="button down">-</a></td><td align="center"><span class="new-character-int">5</span><td align="right"><a class="button up">+</a></td></td></tr></table>',
            '                   <td>CON:</td>',
            '                   <td><table width="80%"><tr><td><a class="button down">-</a></td><td align="center"><span class="new-character-con">5</span><td align="right"><a class="button up">+</a></td></td></tr></table>',
            '               </tr>',
            '           </table>',
            '   </tr>',
            '</table>'
        ].join(''))

        var points = 0;
        var stats = {
            str:5,
            dex:5,
            int:5,
            con:5
        }

        $('.new-character-stats .down').unbind('click').bind('click', function() {
            var $field = $(this).parent().parent().find('span');
            var attr = $field[0].className.split('-')[2]
            var val = parseInt($field.text());
            if(val>0) {
                points++
                stats[attr]--;
                $field.text(stats[attr])
                $('.new-character-pool').text(points)
            }
            console.log([attr, val].join(','))
            return false;
        })

        $('.new-character-stats .up').unbind('click').bind('click', function() {
            var $field = $(this).parent().parent().find('span');
            var attr = $field[0].className.split('-')[2]
            var val = parseInt($field.text());
            if(points>0) {
                points--
                stats[attr]++;
                $field.text(stats[attr])
                $('.new-character-pool').text(points)
            }

            console.log([attr, val].join(','))
            return false;
        })

        $('#enter-world').unbind('click').bind('click', function() {
            $.ajax({
              type: 'GET',
              url: '/create-character',
              data: {name:$('input[name="new-character-name"]').val(), str:stats.str, dex:stats.dex, int:stats.int, con:stats.con, token: authtoken},
              success: function(data) {
                  if(data.success) {
                      connect(data.id);
                  } else {
                      $('.new-character-name-status').text(' ' + data.error).css({color:'red'})
                      console.log('username taken')
                  }
              },
              dataType: 'json'
            });
        });

    });

});