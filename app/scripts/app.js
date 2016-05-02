var App = (function (window, $) {

  'use strict';

  var

    md = new MobileDetect(window.navigator.userAgent),

    elementType = md.mobile() ? '<img>' : '<video>',

    elementSrc = md.mobile() ? 'images/cover.jpg' : 'media/teaser.mp4',

    element = $(elementType, {}),

    root = $('#root'),

    container = root.find('.o-artwork__container'),
    
    jsMouse = $('.js-mouse-follower'),

    //width = $(window).width(),

    //height = $(window).height(),

    init = function () {
      cache();
      bind();
    },

    cache = function () {

      element.attr('src', elementSrc);

      if ('autoplay' in element[0]) {
        element.attr('autoplay', 'autoplay');
        element.attr('loop', 'loop');
      }

      container.append(element);
    },

    bind = function () {
      
      var resizeTimeout;
      $(window).on('resize', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function () {
          updateLayout();
        }, 100);

      });
      updateLayout();
      
      $('body').on(Modernizr.touch ? 'touchmove': 'mousemove', function (e) {
        
        var mouseX = e.pageX - jsMouse.width()/2,
            mouseY = e.pageY - jsMouse.height()/2;
            
        if(!jsMouse.is(':visible')) {
          jsMouse.show();
        }
        
        
        TweenMax.to(jsMouse, .4, {
            x: mouseX,
            y: mouseY
        })
      })
    },

    updateLayout = function () {

      var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        aspectRatio = Math.min(windowWidth / element.width(), windowHeight / element.height());

      element.css({
        'min-height': 0,
        'min-width': 0,
        'position': 'absolute',
      });

      element.parent().width(windowWidth).height(windowHeight);

      var shift = 0;
      if (windowWidth / windowHeight > aspectRatio) {
        element.width(windowWidth).height('auto');
        // shift the element up
        var height = element.height();
        shift = (height - windowHeight) / 2;
        if (shift < 0) {
          shift = 0;
        }
        element.css("top", -shift);
      } else {
        element.width('auto').height(windowHeight);
        // shift the element left
        var width = element.width();
        shift = (width - windowWidth) / 2;
        if (shift < 0) {
          shift = 0;
        }
        element.css("left", -shift);
      }

    },
      
      loadForms = function () {
        $('.o-pages__home').fadeOut('slow');
        $
      };

  

  // public API
  return {
    init: init,
    loadForms: loadForms
  }

})(window, jQuery);