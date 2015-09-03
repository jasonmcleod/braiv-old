var container = {
	open:function(data) {
        $('.container').remove(); // only allow one container open at a time for now
        $container = $([
            '<div class="container modal box" container="' + data.container + '">',
            '   <div class="title">' + manager.items[manager.world_items[data.container].item].name + '</div>',
            '   <div class="items"></div>',
            '</div>'
        ].join(''));

        $('#container').append($container);

        console.log($('.container[container="' + data.container + '"] .items'))
		for(var i in data.items) {
        	console.log(i);
        	$('.container[container="' + data.container + '"] .items').append("<div container='" + data.container + "' value='" + data.items[i].value + "' item='" + data.items[i].item + "' index='" + i + "' class='sprite item' style='background-image:url(" + paths.items + manager.items[data.items[i].item].sprite + ".gif); top:" + data.items[i].y + "px; left:" + data.items[i].x + "px'>&nbsp;</div>");            

        	$container.draggable({
	            handle:'.title',
                snap:boxSnapSelectors

        	});
        }

        $container.show();

    },
	close:function() {
         $('.container').remove();
    },
    removeItem:function(data) {
    	$('.container[container="' + data.container + '"] [index="' + data.index + '"]').remove();
    	console.log(data)
    }

}