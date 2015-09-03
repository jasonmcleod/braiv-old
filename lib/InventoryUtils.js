module.exports = {
	// calls the indentify() method on an inventory item
	inventory_identify: function(item, character) {
		InventoryItem.find({id:item}).done(function(err, results) {
			if(err) console.log(err);
			var quantity = results[0].quantity == 1 ? 'a' : '(' + results[0].quantity + ')';

			Hooks.handle('IdentifyInventoryItem', {item:item, character:character}, function(data) {
				if((data.hasOwnProperty('preventIdentify') && !data.preventIdentify) || !data.hasOwnProperty('preventIdentify')) {
					character.sendMessage('You see ' + quantity + ' ' + gameState.items[results[0].item].name);
				}
			});
		});
	}
};