app.factory('LocalPlayer', function(assets) {

	function LocalPlayer(options) {
		_.extend(this, options || {});
		this.xp = 10000;
		this.level = function() {
			return assets.levels.eval(this.xp);
		}
		return this;
	};

	LocalPlayer.build = function(data) {
		console.log('wtf is this');
	};

	return LocalPlayer;
});