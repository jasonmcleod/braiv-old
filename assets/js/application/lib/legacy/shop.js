var shop = {
    open:function(data) {
        console.log(arguments)

        // shops > cancel button
        $('#shop .cancel').die('click').bind('click',function() {
            shop.close()
        });

        // show buy/sell dialog
        $('#shopBuySell').show();

        // remove all the previous cart items, reset total, clear list
        $('#cart .slot').removeClass('used').removeAttr('item').removeAttr('quantity').css({background:'none'})
        $('#cart .price .value').text('0');
        $('#cart .gold .value').text(data.gold);

        $('#shop .items ul').remove();

        var itemHTML = '<ul>';
        var total = 0;

        // bind buy button - show distinct shops items
        $('#shopBuySell .buy').unbind('click').bind('click',function() {
            console.log('buy')
            // hide buy/sell dialog, show shop
            $('#shopBuySell').hide();
            $('#shop').show();
            // set checkout button to buy
            $('#cart .checkout').text('Buy')

            // add items from payload to list buffer
            for(var item in data.items) {
                itemHTML += [
                    '<li item="' + data.items[item] + '">',
                    '   <div class="shopitem" style="background-image:url(../assets/items@2x/' + manager.items[data.items[item]].sprite + '.gif)"></div>',
                        manager.items[data.items[item]].name,
                    '   <span class="price">' + manager.items[data.items[item]].price + '</span>',
                    '</li>'
                ].join('');
            }
            itemHTML+= '</ul>';

            // insert into list, update scrollbar
            $('#shop .items .jspPane').html(itemHTML)
            $('#shop .items').data('jsp').reinitialise();

            // order by price
            $('#shop .items .jspPane li').sortElements(function(a, b){
                return parseInt($(a).find('.price').text()) > parseInt($(b).find('.price').text()) ? 1 : -1;
            });

            // bind click event which will add items to cart
            $('#shop .items li').unbind('click').bind('click',function() {
                if($('#cart .slot:not(".used")').length>0) {

                    // what item are they buying?
                    var item = $(this).attr('item');

                    // take the first available slot
                    $slot = $('#cart .slot:not(".used"):first');

                    // show split dialog if the item is stackable (potions)
                    if(manager.items[item].stackable) {

                        // slider max and value
                        $('#split .slider').slider('option', 'max', 100)
                        $('#split .slider').slider('option', 'value', 1)
                        $('#split .max').text(100)
                        $('#split input[name="split-value"]').val(1)

                        $('#split').show();

                        // split button actions > Ok
                        $('#split .split-ok').unbind('click').bind('click', function() {
                            var value = $('#split input[name="split-value"]').val();
                            $slot.attr('item', item);
                            $slot.attr('quantity', value);
                            $slot.addClass('used');
                            $slot.css({backgroundImage:'url(../assets/items@2x/' + manager.items[item].sprite + '.gif)'});

                            // update total
                            total+= manager.items[item].price * value;
                            $('#cart .price .value').text(total);

                            // close split dialog
                            $('#split').hide();

                        });

                        // split button actions > Cancel
                        $('#split .split-cancel').unbind('click').bind('click', function() {
                            $('#split').hide();
                        });
                    } else {

                        if(total + manager.items[item].price > data.gold) {
                            addLog('You can\'t afford that')
                            return false
                        }
                        $(this).hide();
                        $('#shop .items').data('jsp').reinitialise();

                        $slot.attr('item', item);
                        $slot.attr('quantity',1)
                        $slot.addClass('used');
                        $slot.css({backgroundImage:'url(../assets/items@2x/' + manager.items[item].sprite + '.gif)'});

                        // update total
                        total+= manager.items[item].price;
                        $('#cart .price .value').text(total)
                    }
                }
            });

            // click > checkout button
            $('#shop .checkout').unbind('click').bind('click', function() {
                var cart = [];
                $('#cart .used').each(function() {
                    cart.push({
                        item:$(this).attr('item'),
                        quantity:$(this).attr('quantity')
                    });

                })
                socket.emit('buy',{shop: data.shop, cart:cart});
                $('#shop').hide();

            });
        });


        // sell - show inventory items
        $('#shopBuySell .sell').unbind().bind('click',function() {

            var accepts = data.accepts.split(',');

            $('#shopBuySell').hide();
            $('#shop').show();

            // set checkout button to buy
            $('#cart .checkout').text('Sell')

            for(var item in manager.inventory.items) {
                if(manager.inventory.items[item].item != 1 && manager.inventory.items[item].equipped == 0) {

                    if($.inArray(manager.items[manager.inventory.items[item].item].type+'', data.accepts) > -1) {

                        itemHTML += [
                            '<li slot="' + item + '" item="' + manager.inventory.items[item].item + '" quantity="' + manager.inventory.items[item].value + '">',
                            '   <div class="shopitem" style="background-image:url(../assets/items@2x/' + manager.items[manager.inventory.items[item].item].sprite + '.gif)"></div>',
                                manager.items[manager.inventory.items[item].item].name,
                                (manager.inventory.items[item].value>1 ? ' (' + manager.inventory.items[item].value + ')' :''),
                            '   <span class="price">' + Math.round(manager.items[manager.inventory.items[item].item].price / 2) + '</span>',
                            '</li>'
                        ].join('')
                    }
                }
            }
            itemHTML+= '</ul>';
            $('#shop .items .jspPane').html(itemHTML)
            $('#shop .items').data('jsp').reinitialise();

            // order by price
            $('#shop .items .jspPane li').sortElements(function(a, b){
                return parseInt($(a).find('.price').text()) > parseInt($(b).find('.price').text()) ? 1 : -1;
            });

            $('#shop .items li').unbind('click').bind('click',function() {
                if($('#cart .slot:not(".used")').length>0) {

                    // what item are they buying?
                    var item = $(this).attr('item');
                    var quantity = $(this).attr('quantity');
                    var slot = $(this).attr('slot');

                    // take the first available slot
                    $slot = $('#cart .slot:not(".used"):first');

                    // remove from shop list, reinitialise scrollbar
                    $(this).hide();
                    $('#shop .items').data('jsp').reinitialise();

                    $slot.attr('item', item);
                    $slot.attr('quantity', quantity)
                    $slot.attr('slot', slot)
                    $slot.addClass('used');
                    $slot.css({backgroundImage:'url(../assets/items@2x/' + manager.items[item].sprite + '.gif)'});

                    // update total
                    total+= Math.round(manager.items[item].price / 2) * quantity;
                    $('#cart .price .value').text(total)
                }
            });

            $('#shop .checkout').unbind('click').bind('click', function() {
                var cart = []
                $('#cart .used').each(function() {
                    cart.push({
                        slot:$(this).attr('slot'),
                        quantity:$(this).attr('quantity')
                    });
                })
                socket.emit('sell',{shop: data.shop, cart:cart});

                $('#shop').hide();

            });

        });
    },
    close:function() {
        $('#shop, #shopBuySell').hide();
    }
}