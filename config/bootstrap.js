/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
GLOBAL.config = require('../config/config');
GLOBAL._ = require('lodash');

module.exports.bootstrap = function (cb) {

  	// It's very important to trigger this callack method when you are finished 
  	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  	GLOBAL.gameState = new Game({
  		cameraWidth:23,
  		cameraHeight:17
  	}, function() {
        require('../lib/lodash-mixins');
        console.log('Server online');
  		cb();
  	});
};