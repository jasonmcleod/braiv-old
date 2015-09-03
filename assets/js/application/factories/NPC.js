app.factory('NPC', function() {

	function NPC(options) {
		_.extend(this, options || {});
	};

	return NPC;
});