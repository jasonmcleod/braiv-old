module.exports = {
  	_config: {},
  	index:function(req, res, next) {
  		InventoryItem.find({character:req.session.character.id}, function(err, results) {
  			if(err) console.log(err);
  			res.send(results);
  		});
  	},
  	identify:function(req, res, next) {
  		var item = req.param('item');
  		var character = gameState.players[req.session.character.id];
        gameState.inventory_identify(item, character);
  	},
    drop:function(req, res, next) {
        var item = req.param('item');
        var character = gameState.players[req.session.character.id];
        var x = character.x + req.param('x');
        var y = character.y + req.param('y');
        InventoryItem.find({character:character.id, id:item}, function(err, results) {
            if(err) console.log(err);
            WorldItem.create({
                item:results[0].item,
                quantity:results[0].quantity,
                x:x,
                y:y,
                map:character.map
            }, function(err, data) {
                if(err) console.log(err);
                InventoryItem.destroy({character:character.id, id:item}, function(err, results) {
                    console.log('inventory item destroyed')
                });
            });
        });
    },
    move:function(req, res, next) {
        var item = req.param('item');
        var slot = req.param('slot');
        var character = gameState.players[req.session.character.id];
        // todo: make this into a service
        // todo: handle stackable items
        InventoryItem.find({character:character.id, slot:slot}, function(err, results) {
            if(results.length > 0) {
                res.send({status:false});
            } else {
                InventoryItem.find({character:character.id, id:item}, function(err, results) {
                    if(err) console.log(err);
                    results[0].slot = slot;
                    results[0].save(function() {
                        res.send({status:true});
                    });
                });
            }
        });
    },
    add:function(req, res, next) {
        var item = req.param('item');
        var x = req.param('x');
        var y = req.param('y')
        console.log(item, x, y);
        res.send(200);
    }
}