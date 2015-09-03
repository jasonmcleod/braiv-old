module.exports = function(game) {
	this.use = function(character, fixture) {

		var locked = fixture.meta && fixture.meta.locked;

		if(!locked || (locked && character.hasAccessToFixture(fixture))) {
			fixture.visible = false;
			fixture.blocks_view = false;
			game.fixture_broadcastChange(fixture);

			// revert after 5 seconds
			setTimeout(function() {
				fixture.visible = true;
				fixture.blocks_view = true;
				game.fixture_broadcastChange(fixture);
			}, 5000);
		} else {
			character.sendMessage('The door is locked.');
		}
	};

	this.identify = function(character, fixture) {
		var locked = fixture.meta && fixture.meta.locked;
		character.sendMessage('You see a ' + (locked ? 'locked ' : '') + game.fixtures[fixture.fixture].name + '.');
	};

	return this;
}