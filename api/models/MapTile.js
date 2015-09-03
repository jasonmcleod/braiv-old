/**
 * MapTile
 *
 * @module      :: Model
 * @description :: Map tile properties
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  	attributes: {
		name: 		{type:'string'},
		block_walk: {type:'integer'},
		block_view: {type:'integer'},
		rgb: 		{type:'array'}
  	}
};
