module.exports = {

	// find what exists at this position on the map and respond accordingly
	map_identify: function(x, y, map, character) {
		var self = this;

		// check for player
		var foundCharacter = _.find(self.players, {x:x, y:y, map:map});
		if(foundCharacter) {
			Hooks.handle('IdentifyCharacter', {foundCharacter:foundCharacter, character:character}, function(data) {
				if((data.hasOwnProperty('preventIdentify') && !data.preventIdentify) || !data.hasOwnProperty('preventIdentify')) {
					character.sendMessage('You see ' + foundCharacter.name);
				}
			});
			return;
		}

		// check for item
		var item = _.find(self.world_items, {x:x, y:y, map:map});
		if(item) {
			Hooks.handle('IdentifyMapItem', {item:item, character:character}, function(data) {
				if((data.hasOwnProperty('preventIdentify') && !data.preventIdentify) || !data.hasOwnProperty('preventIdentify')) {
					self.item_identify(character, item);
				}
			});
			return;
		}

	  	// check for fixture
		var fixture = _.find(self.world_fixtures, {x:x, y:y, map:map, visible:true});
		if(fixture) {
			Hooks.handle('IdentifyFixture', {fixture:fixture, character:character}, function(data) {
				if((data.hasOwnProperty('preventIdentify') && !data.preventIdentify) || !data.hasOwnProperty('preventIdentify')) {
					self.fixture_identify(character, fixture);
				}
			});
			return;
		}

		// check for npc
		var npc = _.find(self.world_npcs, {x:x, y:y, map:map});
		if(npc) {
			Hooks.handle('IdentifyNPC', {npc:npc, character:character}, function(data) {
				if((data.hasOwnProperty('preventIdentify') && !data.preventIdentify) || !data.hasOwnProperty('preventIdentify')) {
					self.npc_identify(character, npc);
				}
			});
			return;
		}
	},

	// calls the use() method on whatever is found at this position on the map
	map_use: function(x, y, map, character) {
		var self = this;
		// todo: use items
		// todo: use players? (show equipment)

		// check for fixture
		console.log(self)
		var fixture = _.find(self.world_fixtures, {x:x, y:y, map:map, visible:true});
		if(fixture && character.inRangeOf(x, y, 1)) {
			Hooks.handle('UseFixture', {fixture:fixture, character:character}, function(data) {
				if((data.hasOwnProperty('preventUse') && !data.preventUse) || !data.hasOwnProperty('preventUse')) {
					self.fixture_use(character, fixture);
				}
			});
		}
	},


	// collect whatever is at this position on the map
	map_collect: function(id, slot, character) {
		//todo: double check against range
		var item = gameState.world_items[id].item;
		var quantity = gameState.world_items[id].quantity;

		var removeFromMap = function() {
			WorldItem.destroy({id:id}).done(function(err, results) {
				sails.io.sockets.emit('remove-world-item', {item:item});
			});
		};

		if(slot == -1 || slot == undefined) {
			gameState.players[character.id].findInventorySlot(item, function(slot, stack) {
				if(slot!==false) {
					if(stack) {
						stack.quantity+=quantity;
						stack.save(removeFromMap);
					} else {
						InventoryItem.create({
							slot:slot,
							item:item,
							quantity:quantity,
							character:character.id
						},removeFromMap);
					}
				} else {
					character.sendMessage('Your inventory is full');
				}
			});
		} else {
			// todo: check if slot is free
			InventoryItem.create({
				slot:slot,
				item:item,
				quantity:quantity,
				character:character.id
			},removeFromMap);
		}

		console.log(character.name, 'has collected', id);
	},

	// move an item on the map from one tile to another
	map_moveItem: function(item, x, y, character) {
		this.world_items[item].x = x;
		this.world_items[item].y = y;
		sails.io.sockets.emit('world_item-update', this.world_items[item].zipped());
	},

	// returns true if the tile at this position is not blocked (water, wall, etc...)
	map_canWalkOnTile: function(x, y, map) {
		var self = this;
		// note: do the cheapest checks first

		// check for fixtures
	    var fixture = _.find(self.world_fixtures, {x:x, y:y, map:map, visible:true});
	    if(fixture && self.fixtures[fixture.fixture].blocks_walk) return false;

		// check for npcs
	    var npc = _.find(self.world_npcs, {x:x, y:y, map:map});
	    if(npc) return false;

		// check for tiles
	    var blocked = function(tile) { return (_.find(self.mapTiles,{id:tile}) || {block_walk:true}).block_walk;};
	    if(blocked(self.maps[map || 'mainland'].data[y * 1000 + x])) return false;

	    return true;
	}

};