var async = require('async');
var Hooks = {

	bindings:[],

	// register the hook across the app
	bind:function(event, callback) {
		this.bindings.push({event:event, callback:function() {
			try {
				callback.apply(this, arguments);
			} catch(err) {
				console.log('Plugin Error:', err);
				console.log(err.stack);
			}
		}});
	},

	handle:function(event, data, then) {
		var hooks = _.where(Hooks.bindings, {event:event});
		hooks.unshift({
			callback:function(callback) { callback(null,data); }
		});
		async.waterfall(
			hooks.map(function(hook) {
				return hook.callback;
			}
		),function(err, result) {
			if(err) console.log(err);
			then(result);
		});
	}
}

module.exports = Hooks;