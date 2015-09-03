/**
 * MapTile
 *
 * @module      :: Model
 * @description :: Item properties
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  	attributes: {
	  	name: 			{type:'string'},
	    type: 			{type:'string'},
	    sprite: 		{type:'string'},
	    animationType: 	{type:'string', defaultsTo:'static'},
	    price: 			{type:'integer', defaultsTo:100},
	    quality: 		{type:'integer', defaultsTo:1},
	    stack: 			{type:'integer', defaultsTo:1},

	    // if someone sells an item, give them %75 of the value, but also ding them if the durability is lower
	    sellingPrice: function() {
	    	return this.price * this.quality * .75;
	    },

	    // stack value is the total size of a stack (150 wood would be 1 stack of 100 and 1 stack of 50 if the stack value was 100)
	    // this is a convenience method to determine if the item will accept more than 1 in a given slot
	    stackable:function() {
	    	return this.stack > 0 || this.stack==-1;
	    }
  	}

};
