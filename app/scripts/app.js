
  
var App = (function (window, $) {
  'use strict';

    $.fn.scrollTo = function( target, options, callback ){
      
      if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
      
      var settings = $.extend({
        scrollTarget  : target,
        offsetTop     : 50,
        duration      : 500,
        easing        : 'swing'
      }, options);
      
      return this.each(function(){
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
          if (typeof callback == 'function') { callback.call(this); }
        });
      });
    };
  var

    md = new MobileDetect(window.navigator.userAgent),

    //elementType = md.mobile() ? '<img>' : '<video>',
    //elementSrc = md.mobile() ? 'images/unnamed.jpg' : 'media/teaser.mp4',

    elementType = '<img>',
    elementSrc = 'images/unnamed.jpg',

    element = $(elementType, {}),

    main = $('main.o-pages'),

    root = $('#root'),

    btnDown = $('a.o-button--cta'),

    mask = $('.o-mask'),
    
    hashCurrent,
      
    rutaServ = 'http://pizarra.app/',
    //rutaServ = 'http://pizarra.debbie.com.mx/',

    container = root.find('.o-artwork__container'),

    jsMouse = $('.js-mouse-follower'),

    pagination = $('.onepage-pagination'),

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
        var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
        var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;

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

      $('.modal-body').perfectScrollbar();
    },


    updateLayout = function () {

      var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        aspectRatio = Math.min(windowWidth / element.width(), windowHeight / element.height());

      element.css('');

      element.css({
        'min-height': 0,
        'min-width': 0,
        'position': 'absolute',
        'height':'100%'
      });

      element.parent().width(windowWidth).height(windowHeight);

    },

    enableOnePage = function () {
      main.onepage_scroll({
        sectionContainer: "section.o-page",
        responsiveFallback: 600,
        loop: false,
        updateURL: false,
        keyboard: false,
        afterMove: function(index) {
          var h = $('.o-page').eq(index -1).attr('id');

          if(callback_hash) {
            callback_hash(h);
          }
        }
      });
    },
    
    setHash = function (hashParam) {
      var hash = hashParam.replace('#','');

      console.log(hash);
     if(history.replaceState) {
       var href = window.location.href.substr(0,window.location.href.indexOf('#')) + '#' + hash,
        sections = $('.o-pages'),
        target = sections.find('#' + hash);
        console.log(target);
       history.pushState({}, document.title, href);

       if (md.mobile()) {
//         $('html,body').animate({ scrollTop: 500},'fast');
         $('body').scrollTo(target);
        } else {
         main.moveTo(target.index() + 1);
       }
       
       hashCurrent = hash;
     }
    },
    callback_hash,
    hashChange = function (callback) {
      callback_hash = callback;
    },
    
    getReady = function () {
      
      $('.descubre').click(function () { $('.onepage-pagination li:nth-child(2) a').click(); });

      $('.registro').click(function () {
        $('.onepage-pagination li:nth-child(3) a').click();
      });
      $('.comenzar').click(function () {

        var flag = true, $slids = $('.slide1');

        $slids.find('input').each(function () {
          if ($(this).val() == '' && !$(this).hasClass('noValida')) {
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

        if (!$('#terms').is(':checked')) {
          flag = false;
        }

        $(document).off('scroll');
        pagination.fadeOut('fast');

        if (flag) {
          var datos = $('#datosRegistro').serialize();
          $.post(rutaServ + 'trivia/registro', datos, function (data) {
            if (data.status == 1) {
              $('#btnFacebook').fadeOut('fast');
              $slids.fadeOut(500, function () {
                $('.slide2').fadeIn('slow');
              });
              $('[class^="o-form"]').filter('.active').removeClass('active');
              $('.o-form__quest').addClass('active');
              $('.o-control').filter('.active').removeClass('active');
              $('.o-control.segundo').addClass('active');
              $('.nexxt').data('quest', 3);
              window.parent.registro();
            } else {
              $('.primero .mensaje').fadeIn('fast').html(data.message);
              setTimeout(function () {
                $('.primero .mensaje').fadeOut('slow');
              }, 15000);
            }

          }, "json").fail(function (e) {
            $('.primero .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
            setTimeout(function () {
              $('.primero .mensaje').fadeOut('slow');
            }, 15000);
          });


        } else {
          $('.primero .mensaje').fadeIn('fast').html('Debes llenar todos los campos y aceptar los terminos de Mundomex');
          setTimeout(function () {
            $('.primero .mensaje').fadeOut('slow');
          }, 15000);
        }
      });
      $('.nexxt').click(function () {
        var $this = $(this);
        var $data = $this.data('quest');
        console.log($data);
        if ($('.slide' + $data).find('textarea').val() == '') {
          $('.slide' + $data).find('textarea').addClass('error');
        } else {
          if ($data <= 5) {
            $('.slide' + $data).fadeOut(600, function () {
              if ($data == 5) {
                $('.o-control').filter('.active').removeClass('active');
                $('.o-control.final').addClass('active');
                $('.finalBtn').click(function () {
                  if ($('.slide' + $data).find('textarea').val() == '') {
                    $('.slide' + $data).find('textarea').addClass('error');
                  } else {
                    $('input[name="seconds"]').val($con);
                    $.post("http://referee.mx/wp-admin/admin-ajax.php", $("#quizForm1").serialize(), function (data) {
                      if (data.success == 1) {
                        $('.slide' + $data).fadeOut(600);
                        $('[class^="o-form"]').filter('.active').removeClass('active');
                        $('.o-form__thanks').addClass('active');
                        $('.o-control').filter('.active').removeClass('active');
                        window.parent.termina();
                        $(this).unbind('click');
                      } else {
                        $('.final .mensaje').fadeIn('fast').html(data.message);
                        setTimeout(function () {
                          $('.final .mensaje').fadeOut('slow');
                        }, 15000);
                      }

                    }, "json").fail(function (e) {

                      $('.primero .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
                      setTimeout(function () {
                        $('.primero .mensaje').fadeOut('slow');
                      }, 15000);
                    });
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
  var $con = 0;
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  // public API
  return {
    init: init,
    loadForms: loadForms,
    setHash : setHash,
    hashChange : hashChange,
  }

})(window, jQuery);

