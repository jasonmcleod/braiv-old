/**
 * EncounterSpawn
 *
 * @module      :: Model
 * @description :: Encounters have multiple spawns, each encounter references 1 NPC
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
  		npc: 		{type:'integer'},
        minCount: 	{type:'integer', defaultsTo:5},
        maxCount: 	{type:'integer', defaultsTo:10},
        chance: 	{type:'integer', defaultsTo:100},
        encounter:  {type:'integer', defaultsTo:1}
  	}
};
