function FixtureEditorCtrl($scope, assets) {

	assets.fetchFixtures().then(function(data) {
		console.log(data);
		$scope.fixtures = data;
	});

}