/**
 * ChatController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  	_config: {},
  	send:function(req, res, next) {
  		// todo: sanitize?
  		var text = req.param('text');
  		var type = req.param('text') || 'general';
        var character = gameState.players[req.session.character.id];
        var name = character.name;

        if(text.substr(0,1) == '/') {
            Hooks.handle('ChatCommand', {name:name, text:text, type:type, character:character}, function(data) {
                console.log('chat command');
            });
        } else {
            Hooks.handle('Chat', {name:name, text:text, type:type, character:character}, function(data) {
                if((data.hasOwnProperty('preventBroadcast') && !data.preventBroadcast) || !data.hasOwnProperty('preventBroadcast')) {
                    sails.io.sockets.emit('chat', {
                        character:req.session.character.id,
                        name:data.name,
                        type:data.type,
                        text:data.text
                    });
                }
            });
        }
  	}
};
