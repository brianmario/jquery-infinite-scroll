// Infinite Scroll
(function($) {
  $.fn.infinitescroll = function(options) {
    return $(this).each(function() {
      var el = $(this);
      var settings = $.extend({
          url: null,
          triggerAt: 300,
          page: 2,
          appendTo: '.list tbody',
          fade: 'none',
          container: $(document)
        }, options);
      var req = null;
      var maxReached = false;

      var infinityRunner = function() {
        if (settings.url !== null) {
          if  (settings.force || (settings.triggerAt >= (settings.container.height() - el.height() - el.scrollTop()))) {
            settings.force = false;
            // if the request is in progress, exit and wait for it to finish
            if (req && req.readyState < 4 && req.readyState > 0) {
              return;
            }
            $(settings.appendTo).trigger('infinitescroll.beforesend');
            req = $.get(settings.url, 'page='+settings.page, function(data) {
              if (data !== '') {
				
				var elements = $(data);
                if (settings.page > 1) {
                  $(settings.appendTo).append(elements);
                } else {
                  $(settings.appendTo).html(elements);
                }
                
 				// hide, then fade in elements if fade is configured
                if (settings.fade !== 'none' || settings.fade !== null) {
                	elements.css('display', 'none'); // hide() throws an error :/ ?
                	elements.fadeIn(settings.fade);
                }
                
                settings.page++;
                $(settings.appendTo).trigger('infinitescroll.finish');
              } else {
                maxReached = true;
                $(settings.appendTo).trigger('infinitescroll.maxreached');
              }
            }, 'html');
          }
        }
      };

      el.bind('infinitescroll.scrollpage', function(e, page) {
        settings.page = page;
        settings.force = true;
        infinityRunner();
      });

      el.scroll(function(e) {
        if (!maxReached) {
          infinityRunner();
        }
      });

      // Test initial page layout for trigger
      infinityRunner();
    });
  };
})(jQuery);