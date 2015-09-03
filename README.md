# Braiv
### A plugin-friendly Online Open World RPG

#### Hooks
CharacterConnected
	args:
		character
		
CharacterMove
	args:
		character

// Teleport the player when they reach a position on the map
Hooks.bind('CharacterMove', function(args, callback) {
	if(args.character.x==99) { // wait for player to hit x:99
  		args.character.x = 105; // override their x position
  	}
  	callback(null, args); // return args to callback stack without an error
});