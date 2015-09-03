var MapUtils = {
	map_bindUIEvents:function($item) {
        $item.addClass('transferable');
		$item.bind('mouseenter',function() {
            var id = $item.attr('item')
            var x = $item.position().left;
            var y = $item.position().top;
            var left = (cameraWidth-3) / 2 * spriteWidth;
            var width = left + spriteWidth * 3;
            var top = (cameraHeight-3) / 2 * spriteWidth;
            var height = top + spriteWidth * 3;

            if(x >= left && x <=width && y>= top && y<= height) {
                $item.draggable({
                    helper:'clone',
                    appendTo:'#viewport',
                    zIndex:2000,
                    cursorAt:{left:spriteWidth/2, top:spriteHeight/2},
                    start:function(e, ui) {
                        $(e.target).hide().addClass('cloned');
                        ui.helper.show().css({opacity:1});
                    },
                    stop:function(e, ui) {
                        $(e.target).show().removeClass('cloned');
                    }
                });
            } else {
                // if($item.is('.ui-draggable')) {
                //     $item.draggable('destroy')
                // }
            }
        });
	},
	map_moveItem:function(item) {
		consle.log(item)
	}
}

function Game(options) {
	_.extend(this, MapUtils);

    this.paths = {
        maptiles:'assets/tiles/',
        fixtures:'assets/fixtures/',
        items:'/items@2x/',
        npcs:'assets/npcs@2x/',
        players:'pcs/'
    };

    return this;
}