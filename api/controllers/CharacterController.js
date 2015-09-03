module.exports = {
  	_config: {},
  	list:function(req, res, next) {
  		Character.find({user:req.session.user.id}, function(err, characters) {
  			if(err) console.log(err);
  		});
  	},
  	create:function(req, res, next) {
  		var name = req.param('name');
  		if(!name) {
  			res.send({error:'Enter a name for this character'});
  		} else {
  			// todo: make sure character name is available
  			Character.create({user:req.session.user.id, name:name}, function(err, character) {
  				if(err) console.log(err);
  			});
  		}
  	},
    moveBy:function(req, res, next) {
        var character = gameState.players[req.session.character.id];
        var x = character.x + (req.param('x') || 0);
        var y = character.y + (req.param('y') || 0);
        var currentY = character.y;
        var currentX = character.x;
        var map = gameState.players[req.session.character.id].map || 'mainland';
        if(gameState.map_canWalkOnTile(x, y, map)) {
            Hooks.handle('CharacterMove', {character:character}, function() {
                character.x = x;
                character.y = y;
                res.send({x:x,y:y});
            });
        } else {
            if(gameState.map_canWalkOnTile(x, currentY, map)) {
                Hooks.handle('CharacterMove', {character:character}, function() {
                    character.x = x;
                    res.send({x:x,y:currentY});
                });
                return false; // prevent people from getting on corner tiles
            }
            if(gameState.map_canWalkOnTile(currentX, y, map)) {
                Hooks.handle('CharacterMove', {character:character}, function() {
                    character.y = y;
                    res.send({x:currentX,y:y});
                });
            }
        }
    }
};
