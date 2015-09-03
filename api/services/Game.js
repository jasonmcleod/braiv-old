var VIEW_BUFFER = 5;

MapUtils = require('../../lib/MapUtils');
FixtureUtils = require('../../lib/FixtureUtils');
ItemUtils = require('../../lib/ItemUtils');
NPCUtils = require('../../lib/NPCUtils');
EncounterUtils = require('../../lib/EncounterUtils');
InventoryUtils = require('../../lib/InventoryUtils');

Game = function(options, callback) {

	var self = this;

	// mix in all methods
	_.extend(this, options || {});
	_.extend(this, MapUtils);
	_.extend(this, NPCUtils);
	_.extend(this, ItemUtils);
	_.extend(this, FixtureUtils);
	_.extend(this, EncounterUtils);
	_.extend(this, InventoryUtils);

	// setup game state buckets
	self.maps = {};
	self.npcs = {};
	self.items = {};
	self.usecode = {};
	self.players = {};
	self.mapTiles = {};
	self.fixtures = {};
	self.encounters = {};
	self.world_npcs = {};
	self.world_items = {};
	self.permanentNPCs = {};
	self.world_fixtures = {};

	async.series([
		// clear out all encounters, they will be parsed from the tmx map
		function(done) {
			console.log('Truncating encounter instances');
			Encounter.query('TRUNCATE TABLE encounter', function(err, results) { if(err) { console.log(err); }; done(); });
		},
		// clear out all world npcs, fresh spawns!
		function(done) {
			console.log('Truncating world_npcs instances');
			WorldNPC.query('TRUNCATE TABLE worldnpc', function(err, results) { if(err) { console.log(err); }; done(); });
		},
		// remove any items on the ground that may have remained during a crash
		// function(done) {
		// 	console.log('Loading world_items instances');
		// 	WorldItem.query('TRUNCATE TABLE worlditem', function(err, results) { if(err) { console.log(err); }; done(); }); },
		// cache items
		function(done) {
			console.log('Loading item definitions');
			Item.find({}).done(function(err, results) { for(var r=0;r<results.length;r++) { self.items[results[r].id] = results[r]; }; done(); });
		},
		// cache fixtures
		function(done) {
			console.log('Loading Fixture definitions');
			Fixture.find({}).done(function(err, results) { for(var r=0;r<results.length;r++) { self.fixtures[results[r].id] = results[r]; }; done(); });
		},
		// cache the map tiles
		function(done) {
			console.log('Loading MapTile definitions');
			MapTile.find({}, function(err, results) { if(err) {console.log(err); } for(var r=0;r<results.length;r++) { self.mapTiles[results[r].id] = results[r]; }; done(); });
		},
		// cache npcs
		function(done) {
			console.log('Loading NPC definitions');
			NPC.find({}, function(err, npcs) { if(err) { console.log(err); } for(var n in npcs) { self.npcs[npcs[n].id] = npcs[n]; }; done(); });
		},
		// spawn world fixtures
		function(done) {
			console.log('Loading world_fixtures instances');
			WorldFixture.find({}, function(err, results) { if(err) {console.log(err); } for(var r=0;r<results.length;r++) { self.world_fixtures[results[r].id] = results[r]; }; done(); });
		},
		// spawn permanent NPCS
		function(done) {
			console.log('Spawning permanent NPCs (shop keepers, bankers, guards)');
			PermanentNPC.find({}, function(err, permanentNPCs) {
				if(err) console.log(err);
				for(var r=0;r<permanentNPCs.length;r++) { self.permanentNPCs[permanentNPCs[r].id] = permanentNPCs[r]; };
				permanentNPCs = permanentNPCs.map(function(n) { n.permanent = n.id; return n; });
				WorldNPC.create(permanentNPCs, function(err, results) {
					if(err) console.log(err);
					results.forEach(function(n) {
						self.world_npcs[n.id] = n;
					});
					done();
				});
			});
		},
		// parse the map, gzip the data
		function(done) {
			console.log('Loading Map')
			LoadMap(__dirname + '/../../data/maps/' + sails.config.config.map + '.tmx', function(data) {
				self.maps = data.layers;
				self.encounters = data.encounters;
				done();
			});
		},
		// read spawns from the database, and apply them to the fresh parse of the encounters list that we just parsed from the tmx data
		function(done) {
			console.log('Loading encounters and encounter spawns');
			Encounter.create(self.encounters).done(function(err, encounters) {
				EncounterSpawn.find({}, function(err, spawns) {
					console.log('Linking (' + spawns.length + ') EncounterSpawns to (' + encounters.length + ') Encounters');
					for(var e=0;e<encounters.length;e++) {
						self.encounters[encounters[e].id] = _.extend(encounters[e],{
							spawns:_.where(spawns, {encounter:encounters[e].id})
						});
					}
					done();
				});
			});
		},
		function(done) {
			Plugins.load(self, done);
		},
		function(done) {
			Usecode.load(self, done);
		}
	], function() {

		console.log('Spawning test items');
		WorldItem.create({item:1, quantity:250, x:66, y:76, map:'mainland'}).exec(_.noop);
		WorldItem.create({item:1, quantity:250, x:66, y:77, map:'mainland'}).exec(_.noop);
		WorldItem.create({item:2, x:66, y:78, map:'mainland'}).exec(_.noop);
		WorldItem.create({item:2, x:66, y:79, map:'mainland'}).exec(_.noop);
		WorldItem.create({item:2, x:66, y:80, map:'mainland'}).exec(_.noop);
		console.log('Spawning all NPCs')
		self.encounters_spawnAll();

		// persist everything, every 30 minutes
		self.saveloop = setInterval(function() {
			self.persist(self);
		},60 * 30 * 1000);

		// process game tick every 100ms
		self.mainloop = setInterval(function() {
			self.main();
		},100);

		callback.apply(self);
	});

	self.persist = function() {

		// persist all players to DB
		for(var c in self.players) {
			UserService.storeCharacter(self.players[c]);
		}

		//todo: save other important records
	};

	self.main = function() {
		// move npcs around at their own move rate
		self.npc_wander();

		// filter down each players payload, only sending whats in range
		for(var p in self.players) {

			// build package of players in range
			var players = _.filter(_.invoke(self.players, 'zipped'), function(player) {
				if(self.players[p] == player) return true;
				var x = Math.abs(player.x - self.players[p].x);
				var y = Math.abs(player.y - self.players[p].y);
				return x < (self.cameraWidth+VIEW_BUFFER) / 2 && y < (self.cameraHeight+VIEW_BUFFER) / 2;
			});

			// build package of npcs in range
			var npcs = _.filter(_.invoke(self.world_npcs, 'zipped'), function(npc) {
				var x = Math.abs(npc.x - self.players[p].x);
				var y = Math.abs(npc.y - self.players[p].y);
				return x < (self.cameraWidth+VIEW_BUFFER) / 2 && y < (self.cameraHeight+VIEW_BUFFER) / 2;
			});

			// build package of items in range
			var items = _.filter(_.invoke(self.world_items, 'zipped'), function(item) {
				var x = Math.abs(item.x - self.players[p].x);
				var y = Math.abs(item.y - self.players[p].y);
				return x < (self.cameraWidth+VIEW_BUFFER) / 2 && y < (self.cameraHeight+VIEW_BUFFER) / 2;
			});

			// each player gets their own payload
			var payload = {
				players:players,
				npcs:npcs,
				items:items
			};

			// only send the payload if it has changed since the last message
			// todo: send a sync packet every so often to avoid packet loss issues?
			if(!_.isEqual(self.players[p].lastPayload, payload)) {
				sails.io.sockets.socket(self.players[p].socketId).emit('firehose', payload);
				self.players[p].lastPayload = payload;
			}
		}
	};

	// convenience method to send a message to all players
	self.broadcast = function(name, message) {
		sails.io.sockets.emit('chat', {
            character:0,
            name:name,
            type:'global',
            text:message
        });
	};

	return this;
}

module.exports = Game;