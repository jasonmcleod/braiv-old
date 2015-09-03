var Sails = require('sails');

Sails.lift({port:2002}, function(err, sails) {
	if (err) return done(err);

    var items = [
        {
            name:'Gold',
            type:'currency',
            sprite:'gold',
            animationType:'static'
        }
    ];

    Item.create(items).done(function() {
        console.log('Import complete')
        sails.lower();
        process.exit();
    });
});