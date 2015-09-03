module.exports = {
    encounters_spawnAll:function() {
        var self = this;
        // traverse all encounters and spawn NPCs if the conditions are met
        for(var e in self.encounters) {

            var encounter = self.encounters[e];

            // if the timing is right, and the number of living NPCs is too low, spawn more
            if(encounter.spawnTime < Date.now() - encounter.interval && encounter.alive < encounter.maxNpcs) {
                encounter.spawnTime = Date.now();
                // each encounter has n number of spawns, so we traverse them all
                for(var n in encounter.spawns) {
                    // select a random number of npcs to spawn, based on the minCount property for this spawn
                    for(var c=0; c<_.random(encounter.spawns[n].minCount,encounter.spawns[n].maxCount);c++) {
                        var spawned = false;
                        var spawnX = _.random(encounter.x,encounter.x+encounter.width);
                        var spawnY = _.random(encounter.y,encounter.y+encounter.height);
                        var map = encounter.map;
                        // ensure the selected spawn point is not blocked (water, wall, etc...)
                        if(self.map_canWalkOnTile(spawnX, spawnY, map)) {
                            WorldNPC.create({
                                npc:encounter.spawns[n].npc,
                                x:spawnX,
                                y:spawnY,
                                map:map,
                                encounter:encounter.id
                            }, function(err, result) {
                                if(err) console.log(err);
                                self.world_npcs[result.id] = result;
                                encounter.alive++;
                            });
                        } else {
                            console.log('cant spawn here:', spawnX, spawnY, map)
                        }
                    }
                }
            }
        }
    }
};