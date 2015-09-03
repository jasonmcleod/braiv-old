var hijackRightClick = false;
var spriteWidth = 32;
var spriteHeight = 32;
var cameraWidth = 23;
var cameraHeight = 17;
var cameraCenterX = Math.floor((cameraWidth)/2)
var cameraCenterY = Math.floor((cameraHeight)/2)
var mapHeight = 1000;
var mapWidth = 1000;
var cameraX = 0;
var cameraY = 0;
var spriteSheet;
var spriteSheetTilesWide = 9;
var spriteSheetElement;
var spriteSheetCTX;
var terrainElement;
var terrainCTX;
var connected = false;
var editingNPCs = false;
var editingFixtures = false;
var containerOffsetX = 0;
var containerOffsetY = 0;
var minimapX = 0;
var minimapY = 0;
var assets = {};
var chatFade;
var mouseTargetObject = {id:0};
var mouseTargetObjectBuffer = {id:0};
// var boxSnapSelectors = '.box:visible, #topbar, #viewport, #container';
var tools = {};
var audio = {
    intro:new Audio('/audio/intro.mp3'),
    town:new Audio('/audio/town.mp3')
}
var paths = {
    npcs:'/npcs@2x/',
    terrain:'/terrain.png',
    fixtures:'/fixtures.png',
    items:'/items@2x/',
    players:'/pcs/'
}
var loops = {
    movement: { interval:undefined, rate:200 },
    mainloop: { interval:undefined, rate:200 }
}

var settings = {
    audio:true,
    touch_move_touch_count:2,
    touch_interact_touch_count:1
}


var TYPE_NPC = 1;
var TYPE_PLAYER = 2;

function todo(what) {
    console.log('TODO:' + what)
    console.log(arguments)
}

function preload(what, path, callback) {
    var sheet = {}
    sheet.canvas = document.createElement('canvas');
    sheet.canvas.style.display = 'none'
    document.body.appendChild(sheet.canvas);
    sheet.image = new Image();
    sheet.image.src = path;
    sheet.image.onload = function() {
        sheet.canvas.width = this.width;
        sheet.canvas.height = this.height;
        sheet.ctx = sheet.canvas.getContext('2d')
        sheet.ctx.drawImage(this,0,0);
        assets[what] = sheet;
        callback(sheet);
    }
}


$(function() {

    // center container, bind window.resize to center again
    // centerContainer()
    // $(window).bind('resize', centerContainer);

    // cache some selectors
    $viewport = $("#viewport");
    $me = $('#me');
    $playerHPlabel = $('#player-hp-label');
    $playerHPvalue = $('#player-hp-value');
    $playerXPlabel = $('#player-xp-label');
    $playerXPvalue = $('#player-xp-value');
    $chat = $('#chat');
    $combatlog = $('#combatlog');

    $viewport = $('#viewport');
    $items = $('#items');
    $viewportElements = $('#viewport-elements');
    $inventory = $('#inventory');
    $character = $('#character');
    $droparea = $('#droparea');
    $target = $('#target');
    $targetValue = $('#target-value');
    $bank = $('#bank');
    $split = $('#split');
    $inputWrapper = $('#chat-input');

    $alert = $('.alert');

    showAlert('','').hide()

    // put the player in the center of the screen
    $('#me').css({
        top:(spriteHeight * cameraHeight / 2) - spriteHeight / 2,
        left:(spriteWidth * cameraWidth / 2) - spriteWidth /2
    });

    // put the drop area in the center of the screen
    $droparea.css({
        width:spriteWidth * 3,
        height:spriteHeight * 3,
        top:((spriteHeight * cameraHeight / 2) - spriteHeight / 2) - spriteHeight,
        left:((spriteWidth * cameraWidth / 2) - spriteHeight / 2) - spriteWidth,
    })

    preload('terrain', paths.terrain, function() {
        preload('fixtures', paths.fixtures, function() {
            console.log('preload done')
        });
    });

    // set size of terrain canvas
    terrainElement = document.getElementById('terrain');
    terrainCTX = terrainElement.getContext('2d');
    terrainElement.width = cameraWidth * spriteWidth;
    terrainElement.height = cameraHeight * spriteHeight;

    // set size of terrain-buffer canvas
    terrainBufferElement = document.getElementById('terrain-buffer');
    terrainBufferCTX = terrainBufferElement.getContext('2d');
    terrainBufferElement.width = cameraWidth * spriteWidth;
    terrainBufferElement.height = cameraHeight * spriteHeight;

    // set size of lighting canvas
    lightingElement = document.getElementById('lighting');
    lightingCTX = lightingElement.getContext('2d');
    lightingElement.width = cameraWidth * spriteWidth;
    lightingElement.height = cameraHeight * spriteHeight;
});

function connect(character) {

    // $('#login').remove();
    // audio.intro.pause();
    // audio.town.loop = true;
    // if(settings.audio) audio.town.play();

    // $('#container').show();
    // socket = io.connect("http://" + window.location.hostname,{
    //     reconnect:false
    // });

    // socket.emit('login', {token:authtoken, character:character})
    // socket.on('connect',function() {
    //     connected = true;
    //     loops.movement.interval = setInterval(handleMovementInput, loops.movement.rate)
    //     loops.mainloop.interval = setInterval(mainloop, loops.mainloop.rate)
    //     //game.assets.ready();
    // });

    // socket.on('disconnect', function () {
    //     setTimeout(function() {
    //         $dcAlert = showAlert('Disconnected', 'You have lost connection to the server');
    //         $dcAlert.find('.alert-ok').unbind('click').bind('click', function() {
    //             history.go(-1)
    //         })
    //     },500);
    // });main

    // handle_packets();
}

function randomRange(from,to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function mainloop() {
    render.floodSetup();
    render.minimap();
    render.playerData();
    render.me();
    render.target();
}
