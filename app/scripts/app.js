var App = (function (window, $) {

  'use strict';

  var

    md = new MobileDetect(window.navigator.userAgent),

    elementType = md.mobile() ? '<img>' : '<video>',

    elementSrc = md.mobile() ? 'images/cover.jpg' : 'media/teaser.mp4',

    element = $(elementType, {}),

    main = $('main.o-pages'),

    root = $('#root'),

    btnDown = $('a.o-button--cta'),

    mask = $('.o-mask'),

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

      btnDown.click(function (evt) {
        evt.preventDefault();
        main.moveTo(2);
      });


      updateLayout();

      $('body').on('touchmove mousemove', function (e) {
        var currentY = e.originalEvent.touches ?  e.originalEvent.touches[0].pageY : e.pageY;
        var currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
        
        var mouseX = currentX - jsMouse.width() / 2,
          mouseY = currentY - jsMouse.height() / 2;

        if (!jsMouse.is(':visible')) {
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

      /*var shift = 0;
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
      }*/

    },

    enableOnePage = function () {
      main.onepage_scroll({
        sectionContainer: "section.o-page",
        responsiveFallback: 600,
        loop: false,
        updateURL: true,
        keyboard: false,
        beforeMove: function (index) {

        },
        afterMove: function (index) {

        }
      });
    },

    getReady = function () {
      $('.quiz_section').not('.slide1, .slide2').hide();
      $('.comenzar').click(function () {
        var flag = true, $slids = $('.slide1, .slide2');

        $slids.find('input').each(function () {
          if ($(this).val() == '') {
            $(this).addClass('error');
            flag = false;
          } else {
            $(this).removeClass('error');
          }
        });

        if (!isEmail($('.mlwEmail').val())) {
          flag = false;
          $('.mlwEmail').addClass('error');
        } else {
          $('.mlwEmail').removeClass('error');
        }
        /*
        if ( !$('#terms').attr('checked') ) {
          $('.primero').append('<p>Debes aceptar los terminos de Mundomex</p>')
          flag = false;
        }
        */

        if (flag) {
          $slids.fadeOut(500, function () {
            $('.slide3').fadeIn('slow');
          });
          $('[class^="o-form"]').filter('.active').removeClass('active');
          $('.o-form__quest').addClass('active');
          $('.o-control').filter('.active').removeClass('active');
          $('.o-control.segundo').addClass('active');
          $('.nexxt').data('quest', 3);
        } else {
          console.log('faltan campos');
        }
      });
      $('.nexxt').click(function () {
        var $this = $(this);
        var $data = $this.data('quest');
        console.log($data);
        if ($('.slide' + $data).find('textarea').val() == '') {
          $('.slide' + $data).find('textarea').addClass('error');
          console.log('vacio');
        } else {
          if ($data <= 5) {
            $('.slide' + $data).fadeOut(600, function () {
              if ($data == 5) {
                $('.o-control').filter('.active').removeClass('active');
                $('.o-control.final').addClass('active');
                $('.finalBtn').click(function () {
                  if ($('.slide' + $data).find('textarea').val() == '') {
                    $('.slide' + $data).find('textarea').addClass('error');
                    console.log('vacio');
                  } else {
                    $('.slide' + $data).fadeOut(600);
                    $('[class^="o-form"]').filter('.active').removeClass('active');
                    $('.o-form__thanks').addClass('active');
                    $('.o-control').filter('.active').removeClass('active');
                    //$('.qmn_btn').click();
                    $(this).unbind('click');
                  }
                });
              }
              $data = $data + 1;
              $('.slide' + $data).fadeIn('slow');
              $this.data('quest', $data);
            });
          }
        }

      })
    },

    loadForms = function () {
    };

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  // public API
  return {
    init: init,
    loadForms: loadForms
  }

})(window, jQuery);