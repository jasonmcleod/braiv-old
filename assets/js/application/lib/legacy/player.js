var player = {
    handleInitialPlayerData:function(data) {
        manager.me = data.id;
        player.updatePlayerData(data);
        $('#player-name').text(data.name)
        $('#player-guild-tag').text(data.prefix)
        player.setMap({map:data.map})
    },
    updatePlayerData:function(data) {
        for(var field in data) {
            manager.playerData[field] = data[field]
        }
        if(manager.playerData.gm && manager.playerData.gm!=0) {
            $('#debug').show();
        }
        render.playerData();
    },
    setTarget:function(data) {
        manager.playerData.target = data.id;
        manager.playerData.targetType = data.type;
    },
    died:function() {
        console.log('died');
        $inventory.find('.item').remove();
        render.inventory();
        $target.css({left:-999});
    },
    setMap:function(data) {
        manager.activeMap = data.map;
        map = window['map_' + data.map];
    },
    levelUp:function(data) {
        manager.playerData.attributePoints = data.attributePoints
        manager.playerData.level = data.level
        manager.inventory.items = data.inventory;

        console.log(data)
        addLog({msg:'<span style="color:#0F0">You are now level ' + data.level + '</span>'})
    },
    add:function(data) {
        addLog(data.player + ' has come online')
        console.log(arguments)
    }
}
