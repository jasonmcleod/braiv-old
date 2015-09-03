module.exports = function(req, res, next) {

  	// User is allowed, proceed to the next policy,
  	// or if this is the last policy, the controller
  	if (req.session.user && req.session.character && gameState.players[req.session.character.id]) {
	    return next();
  	} else {
  		if(!req.isSocket) {
	  		res.redirect('/');
  			return;
  		}
	}

  	// User is not allowed
  	// (default res.forbidden() behavior can be overridden in `config/403.js`)
  	return res.forbidden('You are not permitted to perform this action.');
};
