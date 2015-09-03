// todo: move this character class out
function Character(options) {
	_.extend(this, options);
	return this;
}
app.service('user', ['$http', '$q', function ($http, $q) {
    return {
		login:function(username, password) {
			console.log(username, password);
			var deferred = $q.defer();
			$http.post('/user/auth',{username:username, password:password}).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		register:function(username, password) {
			var deferred = $q.defer();
			$http.post('/user/register',{username:username, password:password}).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		characters:function() {
			var deferred = $q.defer();
			$http.post('/user/characters').success(function(data) {
				deferred.resolve(data.characters.map(function(c) { return new Character(c); }));
			});
			return deferred.promise;
		},
		createCharacter:function(data) {
			// todo: handle error cases
			var deferred = $q.defer();
			$http.post('/user/createCharacter', data).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		selectCharacter:function(character) {
			var deferred = $q.defer();
			$http.post('/user/selectCharacter', {character:character}).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	};
}]);
