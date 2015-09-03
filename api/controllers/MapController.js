module.exports = {
    _config: {},
    identify:function(req, res, next) {
        var x = req.param('x') || 0;
        var y = req.param('y') || 0;
        var character = gameState.players[req.session.character.id];
        if(!character) {
            console.log('Error getting character');
            res.send(500);
        } else {
            var map = character.map || 'mainland';
        }

        gameState.map_identify(x, y, map, character);
    },
    use:function(req, res, next) {
        var x = req.param('x') || 0;
        var y = req.param('y') || 0;
        var character = gameState.players[req.session.character.id];
        var map = character.map || 'mainland';

        gameState.map_use(x, y, map, character);
    },
    moveItem:function(req, res, next) {
        var item = req.param('item');
        var character = gameState.players[req.session.character.id];
        var x = character.x + req.param('x');
        var y = character.y + req.param('y');
        gameState.map_moveItem(item, x, y, character);
    },
    collect:function(req, res, next) {
        var item = req.param('item');
        var slot = req.param('slot') || -1;
        var character = gameState.players[req.session.character.id];
        gameState.map_collect(item, slot, character);
    }
};
