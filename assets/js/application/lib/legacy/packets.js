handle_packets = function() {

    socket.on('initialPlayerData',      player.handleInitialPlayerData);
    socket.on('playerData',             player.updatePlayerData);
    socket.on('assets',                 manager.registerAssets);

    socket.on('update_fixture',         manager.updateFixture)
    socket.on('set_fixture',            manager.set_fixture);
    socket.on('damage',                 render.damage);
    socket.on('missed',                 render.missed);
    socket.on('log',                    addLog);
    socket.on('target',                 player.setTarget);
    socket.on('chat',                   addLog);

    socket.on('youdied',                player.died);
    socket.on('levelup',                player.levelUp);
    socket.on('inventory',              manager.inventory.update)
    socket.on('inventory_remove',       manager.inventory.remove);
    socket.on('set_maptile',            manager.set_maptile);
    socket.on('setMap',                 player.setMap)
    socket.on('changeWorldItem',        manager.changeWorldItem)

    socket.on('bank_open',              bank.open);
    socket.on('bank_remove',            bank.remove);
    socket.on('bank_add',               bank.add);

    socket.on('splitstart',             splitStart);
    socket.on('splitcomplete',          splitComplete);

    socket.on('openshop',               shop.open)

    socket.on('opencontainer',          container.open)
    socket.on('removeContainerItem',    container.removeItem)

    socket.on('kick',                   kick)
    socket.on('addPlayer',              player.add)
    socket.on('removeWorldItem',        manager.removeWorldItem)

    socket.on('removeWorldNpc',         manager.removeWorldNpc)

    socket.on('insertWorldFixture',     manager.insertWorldFixture)
    socket.on('deleteWorldFixture',     manager.deleteWorldFixture)
    socket.on('updateWorldFixture',     manager.updateWorldFixture)


    // todo
    socket.on('edit_item',              function(data) { todo('edit_item', data) })
    socket.on('guild_edit',             function(data) { todo('guild_edit', data) })
    socket.on('guild_refresh',          function(data) { todo('guild_refresh', data) })
    socket.on('force_myposition',       function(data) { todo('force_myposition', data) })
    socket.on('force_playerredraw',     function(data) { todo('force_playerredraw', data) })
    socket.on('dropPlayer',             function(data) { todo('dropPlayer', data) })
    socket.on('setSpeed',               function(data) { todo('setSpeed', data) })
    socket.on('theboost',               function(data) { todo('theboost', data) })
    socket.on('inventory_move',         function(data) { todo('inventory_move', data) })
    socket.on('addWorldItem',           function(data) { todo('addWorldItem', data) })





//     //shop functions
//     socket.on('openshop',function(data) {                  shop.openShop(data); });

//     // bank functions
//     socket.on('bank_open',function(data) {                 bank.open(data); });
//     socket.on('bank_remove',function(data) {               bank.remove(data.item); });
//     socket.on('bank_add',function(data) {                  bank.add(data.item); });

//     // container functions
//     socket.on('opencontainer', function(data) {            container.open(data); })
//     socket.on('removeContainerItem', function(data) {      container.removeItem(data); })


//     // world item functions


//     // admin functions
//     socket.on('edit_item', function(data) {                admin.edit.item(data); });

//     // guild functions
//     socket.on('guild_edit', function(data) {               guild.edit(data); });
//     socket.on('guild_refresh', function(data) {            guild.refresh(data); });


//     // force functions
//     socket.on('force_myposition', function(data) {         player.move(game.me, data.x, data.y) });
//     socket.on('force_playerredraw', function(data) {       player.forceRedraw(data); });
//     socket.on('kick',function(data) {                      ui.kick(data); });

//      deprecated
//     socket.on('addPlayer',function(data) {                 player.addPlayer(data.player); });
//     socket.on('dropPlayer',function(data) {                player.dropPlayer(data.player); });
//     socket.on('setSpeed',function(data) {                  player.setSpeed(data.speed); });
//     socket.on('theboost', function() {                     admin.boost(); })
//     socket.on('inventory_move',function(data) {            ui.inventory.move(data.item, data.x, data.y); });
//     socket.on('removeWorldNpc',function(data) {            manager.removeWorldNpc(data.npc); });
//     socket.on('addWorldItem',function(data) { console.log(data)});
//     socket.on('removeWorldItem',function(data) { console.log(data)});

    // todo: move into angular scope
    // socket.on('fixture-update', function(data) {
    //     _.extend(manager.world_fixtures[data.id], data);
    // });

   //  socket.on('firehose',function(data) {
   //      if('players' in data) {
   //          manager.players = data.players;
   //      }

   //      // if('world_npcs' in data) {
   //      //     for(var n in data) {
   //      //         manager.world_npcs[n.id] = new WorldNPC(_.extend(manager.world_npcs[n.id] || {}, data[n]));
   //      //     }
   //      // }

   //      if('world_items' in data) {
   //          manager.world_items = data.world_items
   //      }

   // })
}