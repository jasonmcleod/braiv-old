/**
 * User
 *
 * @module      :: Model
 * @description :: A represntation of a person, who can have multiple characters
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  	attributes: {
		email:{type:'string'},
		username:{type:'string'},
		name:{type:'string'},
		password:{type:'string'},
		activated:{type:'boolean', defaultsTo:true},
		admin:{type:'boolean', defaultsTo:false}
  	}
};
