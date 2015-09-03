module.exports = {
  	_config: {},
  	place:function(req, res, next) {
	  	// todo: ensure only admins can do this
	  	var fixture = req.param('fixture');
	  	var x = req.param('x');
	  	var y = req.param('y');
	  	console.log(fixture, x, y);
	  	WorldFixture.create({
	  		fixture:fixture,
	  		x:x,
	  		y:y
	  	}, function() {
	  		console.log('made??')
	  	});
  	}
};
