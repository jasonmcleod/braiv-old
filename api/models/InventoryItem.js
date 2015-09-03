/**
 * InventoryItem
 *
 * @module      :: Model
 * @description :: An instance of an item, in a characters inventory
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
		character: 	{type:'integer'},
		item: 		{type:'integer'},
		quantity: 	{type:'integer'},
		slot: 		{type:'integer'}
  	},
  	afterUpdate:function(record, cb) {
  		console.log(arguments)
  		gameState.players[record.character].emit('refresh-inventory');
  		cb();
  	},
  	afterCreate:function(record, cb) {
  		console.log(arguments)
  		gameState.players[record.character].emit('refresh-inventory');
  		cb();
  	},
    beforeDestroy:function(critera, cb) {
      gameState.players[critera.where.character].emit('refresh-inventory');
      cb();
    }
};
