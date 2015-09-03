/**
 * WorldItem
 *
 * @module      :: Model
 * @description :: An item that exists on the ground
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  	attributes: {
        item: 		{type:'integer'},
		quantity: 	{type:'integer',	defaultsTo:1},
		x: 			{type:'integer'},
		y: 			{type:'integer'},
		map: 		{type:'string', 	defaultsTo:'mainland'},
  		zipped: function() {
  			return _.zipped(this, ['id','x','y','item','map']);
		}
  	},
    beforeDestroy:function(query, next) {
        var id = query.where.id;
        delete gameState.world_items[id];
        next();
    },
    afterCreate:function(record, next) {
        // sails wont return a true instance, so this mixMethods call with re-wire it with what an instance would have
        gameState.world_items[record.id] = _.mixMethods(record, module.exports.attributes);
        next();
    }
};