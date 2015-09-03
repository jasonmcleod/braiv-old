jQuery.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
  return $(this).each(function(){
    var clicks = 0, self = this;
    var handler = function(event) {
      clicks++;
      if (clicks == 1) {
        setTimeout(function(){
          if(clicks == 1) {
            single_click_callback.call(self, event);
          } else {
            double_click_callback.call(self, event);
          }
          clicks = 0;
        }, timeout || 500);
      }
    };
    jQuery(this).unbind("click").bind("click",handler)
    jQuery(this).unbind("contextmenu").bind("contextmenu",function(e) { handler(e); if(hijackRightClick) { e.preventDefault(); }})
  });
}