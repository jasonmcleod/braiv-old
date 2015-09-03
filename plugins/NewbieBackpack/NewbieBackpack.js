Hooks.bind('CharacterDied', function(args, callback) {

	// todo: this is not tested...
	if(args.character.level <= 4) {
		args.deathEvent.dropItems = false;
	}
	callback(null, args);
});