/**
 * Encounter
 *
 * @module      :: Model
 * @description :: Root level for an encounter, details it's position, size, etc...
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
        active: 	{type:'boolean', 	defaultsTo:true},
        alive:      {type:'integer',    defaultsTo: 0},
        spawnTime:  {type:'integer',    defaultsTo: 0},
        interval: 	{type:'integer', 	defaultsTo: 5000},
        maxNpcs: 	{type:'integer', 	defaultsTo: 16},
        name: 		{type:'string', 	defaultsTo: 'Unnamed Encounter'},
        x: 			{type:'integer', 	defaultsTo: 100},
        y: 			{type:'integer', 	defaultsTo: 100},
        width: 		{type:'integer', 	defaultsTo: 20},
        height: 	{type:'integer', 	defaultsTo: 200},
        map: 		{type:'string',  	defaultsTo:'mainland'},
        spawns:     {type:'array'}
  	},
    zipped: function() {
        return _.zipped(this, ['id','x','y','item','map','owner']);
    },
    living:function() {
        // todo: refactor this as an instance method
        var total = 0;
        for(var n in self.game.world_npcs) {
            if(gameState.world_npcs[n].hp > 0 && gameState.world_npcs[n].encounter == this.id) {
                total++
            }
        }
        return total;
    }
};
