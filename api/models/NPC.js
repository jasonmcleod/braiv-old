/**
 * PermanentNPC
 *
 * @module      :: Model
 * @description :: A non playing character, more of a dictionary item.. which WorldNPC will use to look up info
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
		banker: 		{type: 'boolean', 	defaultsTo: false},
		hostile: 		{type: 'boolean', 	defaultsTo: false},
		guard: 			{type: 'boolean', 	defaultsTo: false},
		merchent: 		{type: 'boolean', 	defaultsTo: false},
		friendly: 		{type: 'boolean', 	defaultsTo: false},
		level: 			{type: 'integer', 	defaultsTo: 1},
		str: 			{type: 'integer', 	defaultsTo: 2},
		dex: 			{type: 'integer', 	defaultsTo: 2},
		int: 			{type: 'integer', 	defaultsTo: 2},
		con: 			{type: 'integer', 	defaultsTo: 2},
		name: 			{type: 'string', 	defaultsTo: 'Unnamed NPC'},
		width: 			{type: 'integer', 	defaultsTo: 1},
		height: 		{type: 'integer', 	defaultsTo: 1},
		armor: 			{type: 'integer', 	defaultsTo: 5},
		minHealth: 		{type: 'integer', 	defaultsTo: 5},
		maxHealth: 		{type: 'integer', 	defaultsTo: 20},
		sprite: 		{type: 'string', 	defaultsTo: 'Snake'},
		walkSpeed: 		{type: 'integer', 	defaultsTo: 500},
		wanderRange: 	{type: 'integer', 	defaultsTo: 5},
		minDamage: 		{type: 'integer', 	defaultsTo: 1},
		maxDamage: 		{type: 'integer', 	defaultsTo: 10},
		attackSpeed: 	{type: 'integer', 	defaultsTo: 50},
		hitChance: 		{type: 'integer', 	defaultsTo: 50}
	}
};
