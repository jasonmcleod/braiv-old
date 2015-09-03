module.exports = {
	maptiles:function(req, res, next) {
		res.send(gameState.mapTiles);
	},
	levels:function(req, res, next) {
		res.send(Levels.list);
	},
	npcs:function(req, res, next) {
		// todo: cache
		NPC.find({},function(err, results) {
			res.send(results);
		});
	},
	fixtures:function(req, res, next) {
		// todo: pull from DB
		res.send(gameState.fixtures);
	},
	world_fixtures:function(req, res, next) {
		res.send(gameState.world_fixtures);
	},
	items:function(req, res, next) {
		res.send(gameState.items);
	},
	world_items:function(req, res, next) {
		res.send(gameState.world_items);
	},
	map:function(req, res, next) {
		var layer = req.param('map');
		res.writeHead(200, {'Content-type':'text/javascript','Content-Encoding':'gzip'});
		res.end(gameState.maps[layer].gzipped);
	}
}