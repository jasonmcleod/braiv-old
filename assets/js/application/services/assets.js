app.service('assets', ['$http', '$q', 'Fixture', 'WorldFixture', 'Item', 'WorldItem', 'NPC', function ($http, $q, Fixture, WorldFixture, Item, WorldItem, NPC) {
    var service = {
        levels:{
            data:[],
            eval:function(xp) {
                var ret = 1;
                for(var l=0;l<service.levels.data.length; l++) {
                    if(service.levels.data[l] > xp) {
                        ret = l;
                    } else {
                        continue;
                    }
                }
                return ret;
            }
        },
        items:{},
        world_items:{},
		fetchMapTiles:function() {
			console.log('fetch tiles')
            var deferred = $q.defer();
            $http.get('/assets/maptiles').success(function(data) {
                deferred.resolve(data);
                manager.maptiles = data;
            });
            return deferred.promise;
		},
		fetchNPCs:function() {
			var deferred = $q.defer();
            $http.get('/assets/npcs').success(function(data) {
            	for(var n in data) {
            		// todo: cast as NPC
            		manager.npcs[data[n].id] = new NPC(data[n]);
            		manager.npcs[data[n].id].img = new Image();
            		manager.npcs[data[n].id].img.src = paths.npcs + data[n].sprite + '.png'
            	}
                deferred.resolve(data);
            });
            return deferred.promise;
		},
        fetchFixtures:function() {
            var deferred = $q.defer();
            $http.get('/assets/fixtures').success(function(data) {
                for(var f in data) {
                    manager.fixtures[data[f].id] = new Fixture(data[f]);
                }
                deferred.resolve(manager.fixtures);
            });
            return deferred.promise;
        },
        fetchWorldFixtures:function() {
            var deferred = $q.defer();
            $http.get('/assets/world_fixtures').success(function(data) {
                for(var f in data) {
                    manager.world_fixtures[f] = new WorldFixture(data[f]);
                }
                deferred.resolve();
            });
            return deferred.promise;
        },
        fetchItems:function() {
            var deferred = $q.defer();
            $http.get('/assets/items').success(function(data) {
                for(var i in data) {
                    // todo: remove manager refs
                    manager.items[data[i].id] = new Item(data[i]);
                    manager.items[data[i].id].img = new Image();
                    manager.items[data[i].id].img.src = paths.items + data[i].sprite + '.gif'
                    service.items[data[i].id] = manager.items[data[i].id];
                }
                deferred.resolve();
            });
            return deferred.promise;
        },
        // fetchWorldItems:function() {
        //     var deferred = $q.defer();
        //     $http.get('/assets/world_items').success(function(data) {
        //         for(var i in data) {
        //             manager.world_items[i] = new WorldItem(data[i]);
        //             service.world_items[i] = manager.world_items[i];
        //         }
        //         deferred.resolve();
        //     });
        //     return deferred.promise;
        // },
		fetchLevels:function() {
			console.log('fetch levels')
			var deferred = $q.defer();
            $http.get('/assets/levels').success(function(data) {
                deferred.resolve(data);
                service.levels.data = data;
                manager.levels = data;
            });
            return deferred.promise;
		},
		fetchAll:function() {
			var deferred = $q.defer();
			// todo: $q.all support
			service.fetchMapTiles().then(function() {
				service.fetchNPCs().then(function() {
					service.fetchLevels().then(function() {
                        service.fetchFixtures().then(function() {
                            service.fetchWorldFixtures().then(function() {
                                service.fetchItems().then(function() {
                                    // service.fetchWorldItems().then(function() {
						                deferred.resolve(service);
                                    // });
                                });
                            });
                        });
					});
				});
			});
			return deferred.promise;
		}
	};
	return service;
}]);

