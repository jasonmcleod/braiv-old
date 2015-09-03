var manager = {
    me:undefined,
    activeMap:'mainland',
    lights:[],
    lightValue:1,
    playerData:{
        stunned:false,
        target:false
    },
    targetProtection:true,
    fixtures:{},
    players:{},
    npcs:{},
    items:{},
    world_fixtures:{},
    world_players:{},
    world_npcs:{},
    world_items:{},
    maptiles:[{
        blocks_view:false,
        blocks_walk:false
    }],
    updateFixture:function(data) {
        manager.world_fixtures[data.fixture].x = data.x;
        manager.world_fixtures[data.fixture].y = data.y;
    },
    inventory:{
        items:{},
        update:function(data) {
            manager.inventory.items = data.inventory;
            manager.inventory.weight = data.weight;
            render.inventory();
        },
        remove:function(data) {
            $inventory.find('[item="' + data.item + '"]').remove();
        }
    },
    canWalkOnTile:function(x, y) {
        return true;
        // return manager.maptiles[map[y * 1000 + x]].block_walk == 0
    },
    blocksView:function(x, y) {
        return _.find(manager.world_fixtures, {x:x, y:y, visible:true}) || manager.maptiles[map[y * mapHeight + x]].block_view == 1
    },
    registerAssets:function(data) {
        manager.players=           data.players;
        manager.npcs=              data.npcs;
        manager.world_npcs=        data.world_npcs;
        manager.items=             data.items;
        manager.world_items=       data.world_items;
        manager.fixtures=          data.fixtures;
        manager.world_fixtures=    data.world_fixtures;
        manager.maptiles=          data.maptiles;
        manager.levels=            data.levels;

        for(var i in manager.items) {
            manager.items[i].img = new Image();
            manager.items[i].img.src = paths.items + manager.items[i].sprite + '.gif'
            manager.items[i].img.onload = function() {
//                console.log(this)
            }
        }

        for(var i in manager.npcs) {
            manager.npcs[i].img = new Image();
            manager.npcs[i].img.src = paths.npcs + manager.npcs[i].sprite + '.png'
            manager.npcs[i].img.onload = function() {
//                console.log(this)
            }
        }

    },
    removeWorldItem:function(data) {
        $items.find('div[item="' + data.item + '"]').remove();
        delete manager.world_items[data.item]
    },

    changeWorldItem:function(data) {
        $items.find('[item="' + data.item + '"]').css({backgroundImage:'url(' + paths.items + manager.items[data.changeTo].sprite + '.gif)'})
    },


    insertWorldFixture:function(data) {
        console.log(data)
        manager.world_fixtures[data.id] = data;
    },
    updateWorldFixture:function(data) {
        console.log(data)
        manager.world_fixtures[data.id] = data;
    },
    deleteWorldFixture:function(data) {
        console.log(data)
        delete manager.world_fixtures[data.fixture];
    },


    set_fixture:function(data) {
        if(typeof manager.world_fixtures[data.id] == 'undefined') return;
        manager.world_fixtures[data.id].fixture = data.fixture;
    },
    set_maptile:function(data) {
        map[data.y * 1000 + data.x] = data.tile
        console.log(data)
        window['map_' + data.map][data.y * 1000 + data.x] = data.tile
    },
    removeWorldNpc:function(data) {
        $viewportElements.find('div[index="' + data.npnc + '"]').remove();
        delete manager.world_npcs[data.npc]
    }
}