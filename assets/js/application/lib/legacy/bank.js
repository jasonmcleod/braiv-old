var bank = {
    open:function(data) {
        $('#bank').show();
        $bank.find('.item').remove();
        render.bank(data);
        console.log(data)
    },
    remove:function(data) {
        $('#bank .item[item="' + data.item + '"]').remove();
    },
    add:function(data) {
        render.bank({single:data.item})
    },
    close:function() {
        $('#bank').hide();
    }
}