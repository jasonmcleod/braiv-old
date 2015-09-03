/**
 * PermanentNPC
 *
 * @module      :: Model
 * @description :: Permament NPCs are things like shop keepers, bankers, and guards
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
  		npc: 		{type:'integer', defaultsTo:1},
  		x: 	  		{type:'integer'},
  		y: 	  		{type:'integer'},
  		map: 		{type:'string', defaultsTo:'mainland'},
  		runsShop: 	{type:'integer', defaultsTo:0},
  		name: 		{type:'string', defaultsTo:''}
  	}
};
