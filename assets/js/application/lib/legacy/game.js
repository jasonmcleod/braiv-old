// constants
var TYPE_NOTHING = 0;
var TYPE_NPC = 1;
var TYPE_PLAYER = 2;
var TYPE_FIXTURE = 3;
var VIEWPORT_OFFSET_X = 0;
var VIEWPORT_OFFSET_Y = 0;
var LOG_GENERAL = 1;
var CHAT_GENERAL = 1;
var COLOR_GENERAL = 'orange';
var COLOR_BLACK = 'black';
var CRIMINAL = 10;
var GM = 100;

var DEAD_BODY_STAGE_1 = 15;
var DEAD_BODY_STAGE_2 = 17;
var DEAD_BODY_STAGE_3 = 18;
var ITEM_MOUNT = 52;

// protect

$(function() {
    game.init();
    game.ui.positionElements();
    game.render.cursor();
});

function randomRange(from,to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

var game = {
    // colors:[
    //     'black',
    //     'white'
    // ],
    // containerOffset:{
    //     x:200,
    //     y:0
    // },
    // viewportOffset:{
    //     x:10,
    //     y:10
    // },
    animationFrame:0,
    editing:false,
    running:false,
    connected:false,
    authtoken:undefined,
    me:undefined,
    playerData:{
        targetProtection:true
    },
    socket:undefined,
    map:undefined,
    fixtureMap:[],
    settings:{
        host:'localhost',
        port:8001,
//        renderer:'canvas'
    },
    intervals:{
        movement:{
            rate:200,
            loop:0
        },
        mainloop:{
            rate:100,
            loop:0
        },
        animation:{
            rate:100,
            loop:0
        }
    },
    sprites:{
        w:32,
        h:32,
        sourceW:16,
        sourceH:16
    },
//    scene:[],
    //scale:2,
    //resolution:{
        //width:800,
        //height:600
    //},
    camera:{
        x:0,
        y:0,
        w:23,
        h:17
    },
    //dom:{
        //ctx:undefined,
        //canvas:undefined,
        //items:'#viewport-items',
        //players:'#viewport-players',
        //projectiles:'#viewport-projectiles'
    },
    //environment:{
        //rain:false,
        //brightness:1
    //},
    paths:{
        maptiles:'assets/tiles/',
        fixtures:'assets/fixtures/',
        items:'assets/items@2x/',
        npcs:'assets/npcs@2x/',
        players:'pcs/'
    },
    assets:{
        preloadReady:false,
        register:function(data) {
            console.log('register........')
            console.log(data)
            game.players=           data.players;
            game.npcs=              data.npcs;
            game.world_npcs=        data.world_npcs;
            game.items=             data.items;
            game.world_items=       data.world_items;
            game.fixtures=          data.fixtures;
            game.world_fixtures=    data.world_fixtures;
            game.maptiles=          data.maptiles;
            game.levels=            data.levels;
            game.assets.preload();
        },
        preload:function() {

            game.dom.blackblur = new Image();
            game.dom.blackblur.src = 'images/blackblur.png'

            for(var img in game.maptiles) {
                            game.assets.preloadNeeded++;
                            game.maptiles[img].img = new Image();
                            game.maptiles[img].img.index = img;
                            game.maptiles[img].img.src = game.paths.maptiles + game.maptiles[img].sprite;
                            game.maptiles[img].img.onload = function() {
                                game.maptiles[this.index].scaled = game.scaleSprite(this, 'maptiles')
                                game.assets.preloadComplete();
                            }

                        }


            for(var img in game.fixtures) {
                game.assets.preloadNeeded++;
                game.fixtures[img].img = new Image();
                game.fixtures[img].img.index = img;
                game.fixtures[img].img.src = game.paths.fixtures + game.fixtures[img].sprite;
                game.fixtures[img].img.onload = function() {
                    //console.log(this.index)
                    game.fixtures[this.index].scaled = game.scaleSprite(this, 'fixtures')
                    game.assets.preloadComplete();
                }
            }

            for(var img in game.items) {
                game.assets.preloadNeeded++;
                game.items[img].img = new Image();
                game.items[img].img.index = img;
                game.items[img].img.src = game.paths.items + game.items[img].sprite + '.png';
                game.items[img].img.onload = function() {
                    //game.items[this.index].scaled = game.scaleSprite(this, 'items');
                    game.assets.preloadComplete();
                }
            }

        },
        preloadDone:0,
        preloadNeeded:0,
        preloadComplete:function() {
            game.assets.preloadDone++;
            if(game.assets.preloadDone == game.assets.preloadNeeded) {
                console.log('calling ready')
                game.assets.preloadReady = true;
                game.assets.ready();
            }
        },
        registerMap:function(map) {
            game.map = map;
            game.assets.ready();
            console.log('map loaded..')
        },
        ready:function() {
            if(game.assets.preloadReady && typeof game.players != 'undefined' && game.connected && typeof game.maptiles != "undefined" && typeof game.map != "undefined" && !game.running && typeof game.me != 'undefined') {

                console.log('ready called')
                // create fixtureMap array
                for(var fx = 0; fx < 1000; fx++) {
                    game.fixtureMap[fx] = []
                    for(var fy = 0; fy < 1000; fy++) {
                        game.fixtureMap[fx][fy] = false;
                    }
                }

                // fill fixtureMap array
                for(var f in game.world_fixtures) {
                    game.fixtureMap[game.world_fixtures[f].x][game.world_fixtures[f].y] = game.fixtures[game.world_fixtures[f].fixture].block_view == 1 ? true:false;
                }

                // create intervals
                game.intervals.mainloop.loop = setInterval(game.mainloop, 100);
                // window.requestAnimFrame = (function(){
                //     return  window.requestAnimationFrame       ||
                //             window.webkitRequestAnimationFrame ||
                //             window.mozRequestAnimationFrame    ||
                //             window.oRequestAnimationFrame      ||
                //             window.msRequestAnimationFrame     ||
                //             function( callback ){
                //                 window.setTimeout(callback, 1000 / 60);
                //             };
                //  })();
                //
                // (function animloop(){
                //   requestAnimFrame(animloop);
                //   game.mainloop();
                // })();

                //webkitRequestAnimationFrame(animloop)
                game.intervals.animation.loop = setInterval(game.render.animations, game.intervals.animation.rate);
                // game.intervals.movement.loop = setInterval(game.player.checkMovement,game.intervals.movement.rate);

                // render map and minimap
                game.render.viewport();
                game.render.minimap();

                game.running = true;    // this function has run
                game.ready = true;      // assets are ready

                // bind all UI events
                game.ui.bind();



            }
        }
    },
    init:function() {

        // store the context
        game.canvasBuffer = document.getElementById('buffer').getContext('2d');
        game.dom.buffer_element = document.getElementById('buffer');
        game.dom.ctx = document.getElementById('viewport-canvas').getContext('2d');

        // store the canvas element
        game.dom.canvas = $('#viewport-canvas');

        // store the players,npcs, and items elements
        game.dom.viewport = $('#viewport');
        game.dom.players = $('#viewport-players');
        game.dom.npcs = $('#viewport-npcs');
        game.dom.items = $('#viewport-items');
        game.dom.projectiles = $('#viewport-projectiles');

        // set the width of all dom elements
        game.dom.canvas.attr('width',game.sprites.w * game.camera.w);
        game.dom.canvas.attr('height',game.sprites.h * game.camera.h);
        $(game.dom.buffer_element).attr('width',game.sprites.w * game.camera.w * game.scale);
        $(game.dom.buffer_element).attr('height',game.sprites.h * game.camera.h * game.scale);
        game.dom.projectiles.css({width:game.dom.canvas.width(),height:game.dom.canvas.height()});

        game.socket = io.connect("http://" + window.location.hostname,{
            reconnect:false
        });

        game.socket.emit('login',authtoken)
        game.socket.on('connect',function() {
           game.assets.ready();
        });

        game.socket.on('disconnect', function () {
            $('#disconnected').show();
        });

        game.handle_packets();
    },
    tileWalkable:function(x, y) {
        return true;
        // check for terrain blocks..
        // if(game.maptiles[game.map[y * 1000 + x]].block_walk) return false

        // // check for npcs
        // for(var n in game.world_npcs) {
        //     if(game.world_npcs[n].x == x && game.world_npcs[n].y == y) {
        //         return false;
        //     }
        // }

        // // check for fixtures
        // for(var n in game.world_fixtures) {
        //     if(game.world_fixtures[n].x == x && game.world_fixtures[n].y == y && game.fixtures[game.world_fixtures[n].fixture].block_walk == 1) {
        //         return false;
        //     }
        // }

        // return true;
    },
    setFixture:function(data) {
        game.world_fixtures[parseInt(data.id)].fixture = parseInt(data.fixture);
        game.fixtureMap[game.world_fixtures[parseInt(data.id)].x][game.world_fixtures[parseInt(data.id)].y] = game.fixtures[game.world_fixtures[parseInt(data.id)].fixture].block_walk == 1 ? true : false
    },
    addPlayer:function(name) {
        game.ui.addLog(name + ' joined the game', 'white', LOG_GENERAL);
    },
    dropPlayer:function(p) {
        game.ui.addLog(game.players[p].name + ' left the game', 'white', LOG_GENERAL);
        $('#player_' + p).remove();
        delete game.players[p];
    },
    removeContainerItem:function(data) {
        $('.container[container="' + data.container + '"] .item[index="' + data.index + '"]').remove();
    },
    boost:function() {
        if(game.players[game.me].gm===1) {
            clearInterval(game.intervals.movement.loop);
            game.intervals.movement.loop = setInterval(game.player.checkMovement,50);
        }
    },
    scaleSprite:function(which, asset) {
        var width = which.width * game.scale;
        var height = which.height * game.scale;
        $('body').append('<canvas id="canvas-scaler-' + asset + '-' + which.index + '" width="' + width + '" height="' + height + '" class="canvas-scaler"></canvas>');
        var ctx = document.getElementById('canvas-scaler-' + asset + '-' + which.index).getContext('2d');

        //ctx.fillStyle = 'rgb(255,0,255)';
        //ctx.fillRect(0,0,32,32)
        ctx.drawImage(which,0,0);
        var buffer = [];
        for(var x=0; x<which.width; x++) {
            buffer[x] = []
            for(var y=0; y<which.height; y++) {
                buffer[x][y] = ctx.getImageData(x,y,1,1)
            }
        }

        ctx.clearRect(0,0,width,height)
        for(var x=0; x<which.width; x++) {
            for(var y=0; y<which.height; y++) {
                if(buffer[x][y].data[3] == 255) {
                    ctx.fillStyle = 'rgb(' + buffer[x][y].data[0] + ',' + buffer[x][y].data[1] + ',' + buffer[x][y].data[2] + ')'
                    ctx.fillRect(x*2,y*2,2,2)
                }
            }
        }

        //game.maptiles[this.index].scaled = document.getElementById('canvas-scaler-' + this.index);
        return document.getElementById('canvas-scaler-' + asset + '-' + which.index);
    }

}//EOF