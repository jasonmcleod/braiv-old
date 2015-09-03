app.factory('Item', function() {

	function Item(options) {
		_.extend(this, options || {});
		this.animationType = 'static';
	};

	return Item;
});