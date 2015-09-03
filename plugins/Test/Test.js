Hooks.bind('CharacterConnected', function(args, callback) {
	game.broadcast('Server', args.character.name + ' has connected');
  	callback(null, args);
});

Hooks.bind('CharacterDisconnected', function(args, callback) {
	game.broadcast('Server', args.character.name + ' has disconnected');
  	callback(null, args);
});

Hooks.bind('UseFixture', function(args, callback) {
	// args.preventUse = true;
  	callback(null, args);
});

Hooks.bind('IdentifyFixture', function(args, callback) {
	// args.preventIdentify = true;
  	callback(null, args);
});

Hooks.bind('IdentifyMapItem', function(args, callback) {
	// args.preventIdentify = true;
	console.log('derp map item', args)
  	callback(null, args);
});

Hooks.bind('IdentifyInventoryItem', function(args, callback) {
	// args.preventIdentify = true;
	console.log('derp inventory item', args)
  	callback(null, args);
});

Hooks.bind('Chat', function(args, callback) {
	//args.preventBroadcast = true;
  	callback(null, args);
});

Hooks.bind('ChatCommand', function(args, callback) {
	console.log(args.command);
	console.log(args.params);
  	callback(null, args);
});
