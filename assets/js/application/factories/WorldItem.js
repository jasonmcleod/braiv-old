app.factory('WorldItem', function() {

	function WorldItem(options) {
		_.extend(this, options || {});
	};

	return WorldItem;
});