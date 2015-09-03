var Sails = require('sails');

Sails.lift({port:2002}, function(err, sails) {
	if (err) return done(err);

    var items = [
		{
			id:1,
			name:'chair'
		},
		{
			id:2,
			name:'door',
			blocks_view:true,
			blocks_walk:true
		}
    ];

    Fixture.create(items).done(function() {
        console.log('Import complete')
        sails.lower();
        process.exit();
    });
});

