var crypto = require('crypto');
var hashPassword = function(password) {
	var cipher = crypto.createCipheriv('des-ede3-cbc', sails.config.config.encryption_key, sails.config.config.encryption_iv);
	var ciph = cipher.update(password, 'ascii', 'hex');
	ciph += cipher.final('hex');
	return ciph;
}
UserService = {
	// checks if a name is taken
	exists:function(username, callback) {
		User.find({username:username}, function(err, results) {
			if(err) {
				console.log(err);
			} else {
				callback(results.length>0);
			}
		});
	},

	// authenticates user
	authenticate: function(username, password, callback) {
		// todo: encrypt password check
		var hashed = hashPassword(password);
  		User.find({username:username, password:hashed}, function(err, records) {
  			if(err || records.length<=0) {
  				callback({error:'No User'});
  				return;
  			} else {
  				callback({data:records[0]});
  				return;
  			}
  		});
	},

	// create a new user
	create: function(data, callback) {
		UserService.exists(data.username, function(exists) {
			if(!exists) {
				data.password = hashPassword(data.password);
				User.create(data, function(err, result) {
					callback(200);
				});
			} else {
				callback({error:'Username is taken'});
			}
		});
	},

	// persist character data
	storeCharacter: function(character, callback) {
		Character.update(character.id, character).done(function(err, result) {
			if(err) console.log(err);
			console.log('Stored character: (' + character.id + ') ' + character.name);
			if(typeof callback == 'function') callback();
		});
	}
}
module.exports = UserService;