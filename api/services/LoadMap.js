var tmx = require('tmx-parser');
var zlib = require('zlib');
// loads a .tmx map file
var LoadMap = function(file, callback) {

	var ret = {layers:{}, encounters:{}};

	var queue = 0;
	var queueDone = 0;
	var queueCheck = function() { return queue == queueDone; };

	var done = function() {
		callback(ret);
	};

	// todo: refactor with promises or async.waterfall
	tmx.parseFile(file, function(err, map) {
  		if (err) throw err;
  		for(var l = 0; l < map.layers.length; l++) {
  			if(map.layers[l].type == 'tile') {
  				(function(layer) {
  					var data = layer.tiles.map(function(tile) {
			  			return tile.gid;
	  				});
  					var arrayWrap = 'var map_' + layer.name + '=[' + data.toString() + ']';
  					queue++;
					zlib.gzip(arrayWrap, function(_, result) {
						ret.layers[layer.name] = {
	  						data:data,
	  						gzipped:result
	  					}
	  					queueDone++;
	  					if(queueCheck()) done();
					});
				})(map.layers[l]);
			} else if(map.layers[l].type == 'object') {
				queue++;
				ret.encounters = map.layers[l].objects.map(function(e) {
					return {
						x:~~(e.x / sails.config.config.tileSize),
						y:~~(e.y / sails.config.config.tileSize),
						width:~~(e.width / sails.config.config.tileSize),
						height:~~(e.height / sails.config.config.tileSize),
					}
				});
				queueDone++;
				if(queueCheck()) done();
			}
  		}
	});
}

module.exports = LoadMap;