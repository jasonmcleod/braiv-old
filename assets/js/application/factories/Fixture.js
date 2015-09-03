app.factory('Fixture', function() {

	function Fixture(options) {
		_.extend(this, options || {});
		this.animationType = 'static';
	};

	return Fixture;
});