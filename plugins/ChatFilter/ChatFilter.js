Hooks.bind('Chat', function(args, callback) {
	var blacklist = [
		'fuck',
		'shit',
		'ass',
		'asshole'
	];
	var fill = function(length) {
		var str = [];
		for(var i=0;i<length;i++) { str.push('.'); }
		return str.join('');
	}
	// todo: this fails on things like "assemble" because it finds the string "ass"
	for(var w=0; w<blacklist.length;w++) {
		var match = new RegExp(blacklist[w], "ig");
		args.text = args.text.replace(match, fill(blacklist[w].length));
	}
  	callback(null, args);
});