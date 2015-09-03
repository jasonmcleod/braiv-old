module.exports = {

	// send a message to the player that indicates what NPC they've just identified
	npc_identify:function(character, npc) {
		var self = this;
		var name = npc.permanent > 0 ? self.permanentNPCs[npc.permanent].name : ' a ' + self.npcs[npc.npc].name;
		character.sendMessage('You see ' + name);
	},
	// called by the main loop, this method keeps NPCs busy.
	npc_wander:function() {
		var server = this;
		var now = Date.now();
		for(var n in server.world_npcs) {
			// if this npc has a target, persue them
		  	if(server.world_npcs[n].target>0) {
		  		// todo seek an NPC target..
		  		// guards vs monsters
		      	if(server.world_npcs[n].targetType==TYPE_NPC) {

		      	// guards vs criminal players
		      	} else if(server.world_npcs[n].targetType==TYPE_PLAYER){

		      	}
			} else { // if theres no target, look for one in range
				if(server.npcs[server.world_npcs[n].npc]) {
				    if(server.npcs[server.world_npcs[n].npc].hostile == 1 || server.npcs[server.world_npcs[n].npc].guard == 1) {
				    	server.world_npcs[n].findTarget();

				        // todo: remove this when other NPCs actually work
				        server.world_npcs[n].wander();
				    } else if(server.npcs[server.world_npcs[n].npc].merchant == 1 || server.npcs[server.world_npcs[n].npc].banker) {
				        // derp around a little
				        server.world_npcs[n].wander();
				    }
				}
			}
		}
	}
};