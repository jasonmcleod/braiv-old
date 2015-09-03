/** derp */
module.exports = {
  	_config: {},
  	auth:function(req, res, next) {
  		var username = req.param('username');
  		var password = req.param('password');
  		if(!username || !password) {
  			res.send({error:'Enter a valid username and password'});
  			return;
  		}
 		UserService.authenticate(username, password, function(reply) {
            req.session.user = reply.data;
            if(reply.data) {
 			    res.send({id:reply.data.id});
            } else {
                res.send({error:'Enter a valid username and password'});
            }
 		});
  	},
  	register:function(req, res, next) {
  		var username = req.param('username');
  		var password = req.param('password');
  		if(!username || !password) {
  			res.send({error:'Enter a username and password'});
  			return;
  		}
  		UserService.create({username:username, password:password}, function(reply) {
  			res.send(reply);
  		});
  	},
    characters:function(req, res, next) {
        console.log(req.session.user.id)
        Character.find({user:req.session.user.id}, function(err, characters) {
            if(err) {
                console.log(err);
            } else {
                res.send({characters:characters});
            }
        });
    },
    createCharacter:function(req, res, next) {
        // todo: check if character name exists
        // todo: verify the attribute values dont exceed 20
        var name = req.param('name');
        var str = req.param('str');
        var dex = req.param('dex');
        var intel = req.param('int');
        var con = req.param('con');
        Character.create({
            user:req.session.user.id,
            name:name,
            str:str,
            dex:dex,
            int:intel,
            con:con,
            level:1,
        }, function(err, result) {
            res.send(result);
        });
    },
    selectCharacter:function(req, res, next) {
        // todo: ensure this user owns this character
        req.session.character = {id:req.param('character')};
        console.log('user has selected', req.param('character'));
        res.send(200);
    },
    connect:function(req, res, next) {
        var character = req.session.character.id;
        if(!character || !req.session.user) {
            res.send(403);
            return;
        } else {
            Character.findOne({user:req.session.user.id, id:character}, function(err, record) {
                if(record) {
                    gameState.players[record.id] = _.extend(record, {
                        authtime:           new Date(),
                        connected:          true,
                        lastSave:           config.SAVE_INTERVAL,
                        loginTime:          (new Date()).getTime(),
                        lastTeleportCheck:  (new Date()).getTime(),
                        cooldowns:          {},
                        lastMoveRequest:    Date.now(),
                        idleTimer:          0,
                        socketId:           req.socket.id,
                        lastPayload:        {}
                    });
                    console.log('User (' + record.id + ') ' + record.name + ' logged in');
                    Hooks.handle('CharacterConnected', {character:gameState.players[record.id]}, function(data) {
                        res.send({data:gameState.players[record.id]});
                    });

                } else {
                    res.send({error:'Invalid character'});
                }
                // todo: send asset data
                // todo: send inventory, or have user request it
                // todo: calculate weight
                // todo: send welcome message
            });
        }




        // begin legacy code
        // console.log('register ' + token)
        //  console.log('use character ' + character)
        //  mysql.query('SELECT * FROM accounts WHERE token = "' + token + '"', function selectCb(err, results, fields) { if (err) { throw err; }
        //     if(results.length==1) {
        //         mysql.query('SELECT * FROM characters WHERE account = ' + results[0].id + ' AND id = ' + character, function selectCb(err, results, fields) { if (err) { throw err; }
        //             if(results.length==1) {

        //                 var record = results[0];
        //                 server.players[record.id] = {
        //                     authtime:           new Date(),
        //                     connected:          true,
        //                     sessionId:          client.id,
        //                     id:                 record.id,
        //                     level:              levels.whatLevel(record.xp),
        //                     str:                record.str,
        //                     dex:                record.dex,
        //                     con:                record.con,
        //                     int:                record.int,
        //                     xp:                 record.xp,
        //                     name:               record.name,
        //                     status:             record.status,
        //                     criminal:           record.criminal,
        //                     x:                  record.x,
        //                     y:                  record.y,
        //                     spawnX:             record.spawnX,
        //                     spawnY:             record.spawnY,
        //                     spawnMap:           record.spawnMap,
        //                     map:                record.map || 'mainland',
        //                     hp:                 record.hp,
        //                     lastRegen:          0,
        //                     lastAttack:         0,
        //                     target:             0,
        //                     sprite:             record.sprite,
        //                     mounted:            0,
        //                     attributePoints:    record.attributePoints,
        //                     lastSave:           SAVE_INTERVAL,
        //                     loginTime:          (new Date()).getTime(),
        //                     lastTeleportCheck:  (new Date()).getTime(),
        //                     guild:              record.guild,
        //                     prefix:             record.guild > 0 ? server.guilds[record.guild].tag : '',
        //                     gm:                 record.gm,
        //                     cooldowns:          {},
        //                     lastMoveRequest:    general.now(),
        //                     idleTimer:          0
        //                 }

        //                 // now that the player object exists.. calculate some things
        //                 server.players[record.id].maxhp = player.hpMax(client);

        //                 server.connections[record.id] = {
        //                     client:client
        //                 }

        //                 client.emit('assets',{
        //                     //players:            server.players,
        //                     maptiles:           server.maptiles,
        //                     fixtures:           server.fixtures,
        //                     world_fixtures:     server.world_fixtures,
        //                     items:              server.items,
        //                     world_items:        server.world_items,
        //                     npcs:               server.npcs,
        //                     world_npcs:         server.world_npcs,
        //                     levels:             levels.table
        //                 });
        //                 //packets.send.addPlayer(record.id);
        //                 sio.sockets.emit('addPlayer', {player: server.players[record.id].name})

        //                 var youare = server.players[record.id];
        //                 logger.player(record.name + ' has joined the game (' + record.id + ')')

        //                 mysql.query("USE " + config.db.database + ";");
        //                 mysql.query("SELECT * FROM inventory_items WHERE `character` = " + record.id, function selectCb(err, results, fields) {  if (err) { throw err; }
        //                     server.players[record.id].inventory = {};
        //                     for(var r=0;r<results.length;r++) {
        //                         server.players[record.id].inventory[results[r].id] =  {}
        //                         for(var field in results[r]) {
        //                             server.players[record.id].inventory[results[r].id][field] = results[r][field];

        //                         }
        //                     }
        //                     //packets.send.inventory(client);
        //                     player.inventory.send(client)

        //                     mysql.query("USE " + config.db.database + ";");
        //                     mysql.query("SELECT * FROM bank_items WHERE `character` = " + record.id, function selectCb(err, results, fields) {  if (err) { throw err; }
        //                         server.players[record.id].bank = {};
        //                         for(var r=0;r<results.length;r++) {
        //                             server.players[results[0].character].bank[results[r].id] = {}
        //                             for(var field in results[r]) {
        //                                 server.players[results[0].character].bank[results[r].id][field] = results[r][field]
        //                             }
        //                         }
        //                     });

        //                     server.players[record.id].weight = player.inventory.totalWeight(client)
        //                     server.players[record.id].maxWeight = player.maxWeight(client)

        //                     server.players[record.id].armor = player.armor(client);
        //                     client.emit('initialPlayerData',youare);

        //                     // attach client to this player object
        //                     server.players[record.id].client = client;

        //                     var online = general.onlineNow();
        //                     packets.send.message(record.id,
        //                         '<span style="color:green">Basjian Public Beta v 0.1b </span><br>' +
        //                         server.motd.message.replace(/\n/g,'<br>') + '<br>' +
        //                         'Online now (' + online.total + '): ' + online.names.join(', ')
        //                     , CHAT_GENERAL, COLOR_IDENTIFY)

        //                     logger.info('Online now (' + online.total + '): ' + online.names.join(', '))
        //                 });

        //                 //revoke token
        //                 mysql.query("UPDATE accounts SET token=NULL WHERE token = '" + token + "'", function selectCb(err, results, fields) {  if (err) { throw err; }
        //                     console.log('token nullified')
        //                 });
        //             }
        //         });
        //     } else {
        //         console.log('no user with that token')
        //     }
        // });




















    }
};
