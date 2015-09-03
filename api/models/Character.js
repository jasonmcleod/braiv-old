/**
 * Character
 *
 * @module      :: Model
 * @description :: Characters are an instance of a player, but include their stats.. instead of their email/password
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName:'characters',

    attributes: {
        user:           {type:'integer'},
        name:           {type:'string'},
        x:              {type:'integer',    defaultsTo:100},
        y:              {type:'integer',    defaultsTo:100},
        hp:             {type:'integer',    defaultsTo:40},
        maxHp:          {type:'integer',    defaultsTo:40},
        xp:             {type:'integer',    defaultsTo:0},
        level:          {type:'integer',    defaultsTo:1},
        guild:          {type:'integer',    defaultsTo:-1},
        prefix:         {type:'string',     defaultsTo:''},
        gm:             {type:'boolean',    defaultsTo:false},
        lastRegen:      {type:'integer',    defaultsTo:0},
        lastAttack:     {type:'integer',    defaultsTo:0},
        target:         {type:'integer',    defaultsTo:0},
        sprite:         {type:'string',     defaultsTo:'warrior'},
        mounted:        {type:'integer',    defaultsTo:0},
        attributePoints:{type:'integer',    defaultsTo:0},
        map:            {type:'string',     defaultsTo:'mainland'},

        inRangeOf:function(x, y, range) {
            return Math.abs(this.x - x)<=1 && Math.abs(this.y - y) <= (range || 1);
        },

        sendMessage:function(message, type) {
            sails.io.sockets.socket(this.socketId).emit('chat', {text:message, name:'Server', type:'global'})
        },

        emit:function(message, args) {
            sails.io.sockets.socket(this.socketId).emit(message, args || {});
        },

        hasAccessToFixture:function(fixture) {
            // console.log('checking access to fixture', fixture);
            // todo: setup access groups
            return false;
        },

        findInventorySlot:function(item, callback) {
            var slots = _.indexes(sails.config.settings.maxInventoryItems);
            InventoryItem.find({character:this.id}, function(err, results) {
                if(gameState.items[item].stackable()) {
                    var stack = _.find(results, {item:item});
                    if(stack) {
                        //todo: limit stacking to items max
                        callback(stack.slot, stack);
                        return;
                    }
                }

                var free = _.difference(slots, results.map(function(r) { return r.slot; }));
                if(free.length > 0) {
                    callback(free[0], false);
                } else {
                    callback(false, false);
                }
            });
        },

        zipped:function() {
            return {
                id:this.id,
                name:this.name,
                prefix:this.prefix,
                x:this.x,
                y:this.y,
                map:this.map,
                sprite:this.sprite
            }
        }
    }
};
