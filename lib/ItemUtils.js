module.exports = {
	// sends the state of an item to all players
	item_broadcastChange: function(item) {
		sails.io.sockets.emit('item-update', item);
	},

	// calls the identify() method on an item
	item_identify: function(character, item) {
		var self = this;
		var quantity = item.quantity || 1;
		character.sendMessage('You see (' + quantity + ') ' + self.items[item.item].name + '.');
		if(self.usecode[self.items[item.item].name] && typeof self.usecode[self.items[item.item].name].identify == 'function') {
			self.usecode[self.items[item.item].name].identify(character, item);
		}
	},

	// calls the use() method on an item
	item_use: function(character, item) {
		var self = this;

		if(self.usecode[self.items[item.item].name] && typeof self.usecode[self.items[item.item].name].use == 'function') {
			self.usecode[self.items[item.item].name].use(character, item);
		}
	}
};