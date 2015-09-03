(function (io) {
    var socket = io.connect();

    socket.on('connect', function socketConnected() {

    });

    window.socket = socket;

})(
  	// In case you're wrapping socket.io to prevent pollution of the global namespace,
  	// you can replace `window.io` with your own `io` here:
  	window.io
);

// todo: preload all assets here, then boostrap
var app = angular.module('app',[]);
var game = new Game({});
$(function() {
    var centerScreen = function() { $('#container').css({top:$(document).height()/2 - $('#container').height()/2}) };
    $(window).on('resize', centerScreen);
    centerScreen();

    $.get('/assets/items', function(data) {
      	manager.items = data;
        angular.bootstrap(document, ['app']);
    });
});