var launchTime = Date.now();
module.exports = {
	login:function(req, res, next) {
		res.view('login/index', {layout:'login/layout'});
	},
	game:function(req, res, next) {
		res.view('game/index', {layout:'game/layout', admin:req.session.user.admin || false});
	},
	status:function(req, res, next) {
		if(gameState) {
			var players = Object.keys(gameState.players).map(function(p) {
				return gameState.players[p].name;
			});
			res.jsonp({
				players:players,
				total:players.length,
				launchTime:launchTime
			});
		} else {
			res.send(500);
		}
	}
}