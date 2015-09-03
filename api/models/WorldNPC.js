/**
 * WorldNPC
 *
 * @module      :: Model
 * @description :: An NPC that exists in the game world
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
module.exports = {
 	attributes: {
 		npc: 		{type:'integer', defaultsTo:1},
        x: 			{type:'integer', defaultsTo:0},
        y: 			{type:'integer', defaultsTo:0},
        map: 		{type:'string', defaultsTo:'mainland'},
        encounter: 	{type:'integer', defaultsTo:1},
        lastMove: 	{type:'integer', defaultsTo:-1},
        permanent: 	{type:'integer', defaultsTo:-1},

        // package up the important state attributes
		zipped: function() {
  			return _.zipped(this, ['id','x','y','npc','map']);
		},

		// find the closest player
		findTarget: function() {
			// todo: implement find target
			// console.log('fingTarget not implented');
		},

		// wander aimlessly.. but not through walls
		wander: function() {
			var now = Date.now();
			if(this.lastMove < now - gameState.npcs[this.npc].walkSpeed) {
		        var dir = _.random(1,8);
		        if(dir == 1) { y = -1; x =  0; } // up
		        if(dir == 2) { y = -1; x =  1; } // up-right
		        if(dir == 3) { y =  0; x =  1; } // right
		        if(dir == 4) { y =  1; x =  1; } // right-down
		        if(dir == 5) { y =  1; x =  0; } // down
		        if(dir == 6) { y =  1; x = -1; } // down-left
		        if(dir == 7) { y =  0; x = -1; } // left
		        if(dir == 8) { y = -1; x = -1; } // left-up
		        if(gameState.map_canWalkOnTile(this.x + x, this.y + y, this.map, true)) {
		            this.x+=x;
		            this.y+=y;
		        }
		      	// if they tried.. consider them moved - makes things look a little more natural
		        this.lastMove = now;
		    }
		}
	}
};

