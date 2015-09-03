var fs = require('fs');
module.exports = {
	load:function(game, callback) {
		var queue = 0;
		var queueDone = 0;
		var queueCheck = function() {
			if(queue == queueDone) callback();
		};

		var blockedFunctions = ['require', 'fs'];

		// find all js files in the ./plugins folder and instantiate them
		fs.readdir('./plugins', function (err, files) {
			if (err) throw err;
			files.forEach( function (file) {
				fs.lstat('./plugins/' + file, function(err, stats) {
					if(err) console.log(err);
					if(stats && stats.isDirectory()) {
						queue++;
						try {
							try {
								fs = require('fs');
								fs.readFile('./plugins/' + file + '/' + file + '.js', 'utf8', function (err,data) {
								  	if (err) {
  										console.log('Plugin Error (' + file + '):', err);
								    	return console.log(err);
								  	}
								  	try {
								  		var code = [
								  			// inject blockedFunctions as local variables, so they are unavailable
								  			'module.exports = function(game, ' + blockedFunctions.join(', ') + ') {',
								  			'	try {',
								  					data,
								  			' 	} catch(err) {',
								  			' 		console.log(err);',
								  			'	}',
								  			'}(game,',
								  				blockedFunctions.map(function(f) {
								  					return 'function(){ console.log("' + f + ' is disabled"); }';
								  				}).join(', '),
								  			')'
								  		].join('');
										eval(code);
								  		console.log('Loaded plugin: ' + file);
								  		queueDone++;
								  		queueCheck();
								  	} catch(err) {
								  		console.log('Failed to load plugin', file);
								  		console.log(err.stack);
								  		queueDone++;
								  		queueCheck();
								  	}
								});
							} catch(err) {
								console.log('Plugin Error (' + file + '):', err);
								console.log(err.stack);
							}
						} catch(err) {
							console.log('Failed to load plugin', file);
						}
					}
				});
			});
		});
	}
}