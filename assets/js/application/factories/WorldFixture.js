app.factory('WorldFixture', function() {

	function WorldFixture(options) {
		_.extend(this, options || {});
	};

	return WorldFixture;
});