var fs = require('fs');
module.exports = {
	load:function(game, callback) {
		game.usecode = {};
		// find all js files in the ./data/usecode folder and evaulate them as UseCode
		fs.readdir('./data/usecode', function (err, files) {
			if (err) throw err;
			files.forEach(function (file) {
				var name = file.replace('.js','');
				try {
					var UseCode = require('./../../data/usecode/' + file);
					game.usecode[name] = new UseCode(game);
					console.log('Loaded usecode:', name);
				} catch(err) {
					console.log(err);
				}
				callback();
			});
		});
	}
}