app.factory('InventoryItem', function() {

	function InventoryItem(options) {
		_.extend(this, options || {});

		this.sprite = function() {
			if(!manager.items[this.item]) return false;
			return game.paths.items + manager.items[this.item].sprite + '.gif';
		};

		this.top = function() {
			return (~~(this.slot / 6) * 38) + 10;
		};

		this.left = function() {
			return this.slot % 6 * 36;
		}
	};

	return InventoryItem;
});