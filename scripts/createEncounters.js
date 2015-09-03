var Sails = require('sails');
var fs = require('fs');
var xml2js = require('xml2js');

Sails.lift({port:2002}, function(err, sails) {
	if (err) return done(err);

    var items = [{
        id: 1,
        active:true,
        interval:5000,
        maxNpcs:16,
        name:'Newbie Snakes',
        x:132,
        y:197,
        width:54,
        height:53,
        map:'mainland',
        spawns:[{
            npc:1,
            minCount:5,
            maxCount:10,
            chance:100
        },
        {
            npc:3,
            minCount:5,
            maxCount:10
        }]
    }];

    Encounter.create(items).done(function() {
        console.log('Import complete')
        sails.lower();
        process.exit();
    });
});