app.service('game', ['$http', '$q', 'input', '$rootScope', 'LocalPlayer', 'WorldNPC', 'WorldItem', function ($http, $q, input, $rootScope, LocalPlayer, WorldNPC, WorldItem) {
    var service = {
		connect:function(options, callback) {
			socket.post('/user/connect', function(data) {
                $rootScope.$apply(function() {
    				connected = true;
            		// todo: refactor the rpcs
            		player.handleInitialPlayerData(data.data);

                    // todo: move manager related things into game service
                    // manager.players[manager.me] = {x:100,y:100};
                    manager.players[data.data.id] = new LocalPlayer(_.extend(manager.players[data.data.id] || {}, data.data));

                    // todo: manage loops from game
                    // loops.movement.interval = setInterval(handleMovementInput, loops.movement.rate)
                    // loops.movement.interval = setInterval(input.movement, loops.movement.rate)
                    loops.mainloop.interval = setInterval(mainloop, loops.mainloop.rate);

                    // flesh out RPCs
            		handle_packets();

                    // console.log(new LocalPlayer({x:1}))
                    if(typeof callback == 'function') callback(new LocalPlayer(data.data));
                });
        	});

            socket.on('fixture-update', function(data) {
                _.extend(manager.world_fixtures[data.id], data);
                console.log(data)
            });

            socket.on('world_item-update', function(data) {
                $rootScope.$apply(function() {
                    _.extend(manager.world_items[data.id], data);
                });
            });

            socket.on('firehose', function(data) {
                if('players' in data) {
                    for(var p in data.players) {
                        // todo: don't clobber the LocalPlayer
                        // todo: cast as WorldNPC
                        // note: _extending causes problems, characters snap into position if they move while off your local screen
                        if(data.players[p].id == manager.me) {
                            // cast as local player
                            manager.players[data.players[p].id] = data.players[p];
                        } else {
                            // cast as player
                            manager.players[data.players[p].id] = data.players[p];
                        }
                    }
                } else {
                    manager.players[data.players] = {};
                }

                if('npcs' in data) {
                    // console.log(data);
                    manager.world_npcs = {};
                    for(var n in data.npcs) {
                        manager.world_npcs[data.npcs[n].id] = new WorldNPC(data.npcs[n]);
                    }
                }

                if('items' in data) {
                    // console.log(data.items);
                    manager.world_items = {};
                    for(var i in data.items) {
                        manager.world_items[data.items[i].id] = new WorldItem(data.items[i]);
                    }
                }
                // if(typeof options.onWorldItemsChanged == 'function') options.onWorldItemsChanged(manager.world_items);
            });
		}
	};
    return service;
}]);

