var Sails = require('sails');
var fs = require('fs');
var xml2js = require('xml2js');

Sails.lift({port:2002}, function(err, sails) {
	if (err) return done(err);

    var parser = new xml2js.Parser();
    var items = [];
    fs.readFile(__dirname + '/../data/MapTiles.xml', function(err, data) {
        if(err) console.log('err',err);
        parser.parseString(data, function (err, result) {
            for(var r in result.resultset.row) {
                var item = {
                    // id: parseInt(result.resultset.row[r].field[0]._),
                    name:result.resultset.row[r].field[1]._,
                    block_walk: parseInt(result.resultset.row[r].field[2]._),
                    block_view: parseInt(result.resultset.row[r].field[3]._),
                    rgb:JSON.parse(result.resultset.row[r].field[4]._ || [])
                };
                items.push(item);
            }
        });

        MapTile.create(items).done(function() {
            console.log('Import complete')
            // sails.lower();
            // process.exit();
        });
    });
});