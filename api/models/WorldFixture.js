/**
 * WorldFixture
 *
 * @module      :: Model
 * @description :: A map object that can be interacted with (door, light, table, etc...)
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  	attributes: {
  		fixture: 	{type:'integer'},
  		visible: 	{type:'boolean', defaultsTo:true},
  		x: 	 		{type:'integer'},
  		y: 	 		{type:'integer'},
  		map: 		{type:'string', defaultsTo:'mainland'},
  		meta: 		{type:'json'}
  	},
  	afterCreate:function(record, next) {
  		gameState.world_fixtures[record.id] = _.mixMethods(record, module.exports.attributes);
        next();
  	}
};

