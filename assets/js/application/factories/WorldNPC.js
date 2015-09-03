app.factory('WorldNPC', function() {

	function WorldNPC(options) {
		_.extend(this, options || {});
	};

	return WorldNPC;
});