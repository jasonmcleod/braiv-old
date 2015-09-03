/**
 * Fixture
 *
 * @module      :: Model
 * @description :: Definition of a fixture, similar to a map tile but overlayed on the base map with transparency and can be interacted with
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  	attributes: {
	  	name: 			{type:'string'},
	  	blocks_view: 	{type:'boolean', defaultsTo:false},
	  	blocks_walk: 	{type:'boolean', defaultsTo:true},
	  	visible: 		{type:'boolean', defaultsTo:true}
  	}
};
