app.service('chat', ['$rootScope', function ($rootScope) {
	var maxMessages = 10;
    var service = {
    	log:[],
    	send:function(message, type) {
    		socket.post('/chat/send', {text:message, type:type || 'global'});
    	},
    	handler:function(callback) {
    		socket.on('chat', function(data) {
    			service.log.push(data);
    			if(service.log.length > maxMessages) service.log.splice(0, service.log.length - maxMessages);
    			$rootScope.$apply(function() {
    				$rootScope.$broadcast('scroll-chat');
    				callback(service.log);
    			});
    		});
    	}
    }
    return service;
}]);