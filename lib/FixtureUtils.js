module.exports = {
	// sends the state of a single ficture to all players
	fixture_broadcastChange: function(fixture) {
		sails.io.sockets.emit('fixture-update', fixture);
	},

	// calls the identify() method on a fixture
	fixture_identify: function(character, fixture) {
		var self = this;
		if(this.usecode[self.fixtures[fixture.fixture].name] && typeof self.usecode[self.fixtures[fixture.fixture].name].identify == 'function') {
			this.usecode[self.fixtures[fixture.fixture].name].identify(character, fixture);
		}
	},

	// cals the use() method on a fixture
	fixture_use: function(character, fixture) {
		var self = this;

		if(self.usecode[self.fixtures[fixture.fixture].name] && typeof self.usecode[self.fixtures[fixture.fixture].name].use == 'function') {
			self.usecode[self.fixtures[fixture.fixture].name].use(character, fixture);
		}
	}
}