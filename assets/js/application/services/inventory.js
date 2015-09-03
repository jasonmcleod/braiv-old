app.service('inventory', ['$rootScope', '$http', '$q', 'InventoryItem', function ($rootScope, $http, $q, InventoryItem) {

    var callbacks = [];

    var service = {
        items:[],
    	fetch:function() {
            var deferred = $q.defer();
            $http.get('/inventory').then(function(data) {
                var items = data.data.map(function(i) {
                    return new InventoryItem(i);
                });
                service.items = items;
                deferred.resolve(items);
            });
            return deferred.promise;
        },
        identify:function(item) {
            var deferred = $q.defer();
            $http.post('/inventory/identify', {item:item.id}).then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        on:function(event, func) {
            callbacks.push({event:event, callback:func});
        },
        refresh:function() {
            service.fetch().then(function(data) {
                service.items = data;
                _.where(callbacks,{event:'change'}).forEach(function(f) {
                    f.callback(service.items);
                });
            });
        }
    };

    socket.on('refresh-inventory', service.refresh);

    return service;
}]);