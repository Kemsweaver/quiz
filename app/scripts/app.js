var App = (function (window, $) {

  'use strict';

  var

    md = new MobileDetect(window.navigator.userAgent),

    elementType = md.mobile() ? '<img>' : '<video>',

    elementSrc = md.mobile() ? 'images/cover.jpg' : 'media/teaser.mp4',

    element = $(elementType, {}),
    
    main = $('main.o-pages'),

    root = $('#root'),

    container = root.find('.o-artwork__container'),
    
    jsMouse = $('.js-mouse-follower'),

    //width = $(window).width(),

    //height = $(window).height(),

    init = function () {
      cache();
      bind();
      getReady();
    },

    cache = function () {

      element.attr('src', elementSrc);

      if ('autoplay' in element[0]) {
        element.attr('autoplay', 'autoplay');
        element.attr('loop', 'loop');
        element.attr('muted', 'muted');
      }

      container.append(element);
      
      enableOnePage();
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
      });
    },

    updateLayout = function () {
      
      console.log('updateLayout');

      var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        aspectRatio = Math.min(windowWidth / element.width(), windowHeight / element.height());
     
     element.css('');
     
      element.css({
        'min-height': 0,
        'min-width': 0,
        'position': 'absolute',
      });

      element.parent().width(windowWidth).height(windowHeight);

      var shift = 0;
      if (windowWidth / windowHeight > aspectRatio) {
        element.width(windowWidth).height('100%');
        // shift the element up
        var height = element.height();
        shift = (height - windowHeight) / 2;
        if (shift < 0) {
          shift = 0;
        }
        element.css("top", -shift);
      } else {
        element.width('100%').height(windowHeight);
        // shift the element left
        var width = element.width();
        shift = (width - windowWidth) / 2;
        if (shift < 0) {
          shift = 0;
        }
        element.css("left", -shift);
      }

    },
    
    enableOnePage = function (){
      main.onepage_scroll({
        sectionContainer: "section.o-page",
        responsiveFallback: 600,
        loop: false,
        keyboard: false
      });
    },

    getReady = function () {
      var finputs = $('.quiz_section').not('.slide1, .slide2').hide();
      console.log(finputs);
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