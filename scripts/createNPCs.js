var Sails = require('sails');
var fs = require('fs');
var xml2js = require('xml2js');

Sails.lift({port:2002}, function(err, sails) {
	if (err) return done(err);

    var parser = new xml2js.Parser();
    var items = [];
    fs.readFile(__dirname + '/../data/NPCs.xml', function(err, data) {
        if(err) console.log('err',err);
        parser.parseString(data, function (err, result) {
            // console.log(result.mysqldump.database[0].table_data[0].row)
            var set = result.mysqldump.database[0].table_data[0].row
            for(var r in set) {
                console.log(set[r].field[0])
                var item = {
                    id: parseInt(set[r].field[0]._),
                    banker:!!parseInt(set[r].field[1]._),
                    hostile:!!parseInt(set[r].field[2]._),
                    guard:!!parseInt(set[r].field[3]._),
                    merchent:!!parseInt(set[r].field[4]._),
                    friendly:!!parseInt(set[r].field[5]._),
                    level:parseInt(set[r].field[6]._),
                    str:parseInt(set[r].field[7]._),
                    dex:parseInt(set[r].field[8]._),
                    int:parseInt(set[r].field[9]._),
                    con:parseInt(set[r].field[10]._),
                    name:set[r].field[11]._,
                    width:parseInt(set[r].field[12]._),
                    height:parseInt(set[r].field[13]._),
                    armor:parseInt(set[r].field[14]._),
                    minHealth:parseInt(set[r].field[15]._),
                    maxHealth:parseInt(set[r].field[16]._),
                    sprite:set[r].field[17]._,
                    walkSpeed:parseInt(set[r].field[18]._),
                    wanderRange:parseInt(set[r].field[19]._),
                    minDamage:parseInt(set[r].field[20]._),
                    maxDamage:parseInt(set[r].field[21]._),
                    attackSpeed:parseInt(set[r].field[22]._),
                    hitChance:parseInt(set[r].field[23]._),
                    runShop:parseInt(set[r].field[24]._),
                };
                items.push(item);
            }
        });

        NPC.create(items).done(function() {
            console.log('Import complete')
            sails.lower();
            process.exit();
        });
    });
});