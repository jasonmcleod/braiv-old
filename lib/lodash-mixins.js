_.mixin({
	'indexes': function(count) {
		return new Array(count).join(',').split(',').map(function(e,i) { return i; });
	},
	'noop':function() {
		// do nothing
	},
	'zipped':function(record, properties) {
		var ret = {};
		for(var p=0;p<properties.length;p++) {
    		var val = record[properties[p]];
    		ret[properties[p]] = typeof val == 'function' ? val() : val;
  		}
  		return ret;
	},
	'mixMethods':function(base, obj) {
		var methods = {};
        for(var k in obj) {
            if(typeof obj[k] == 'function') methods[k] = obj[k];
        }
        _.extend(base, methods);
        return base;
    }
});