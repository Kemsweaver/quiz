
  
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
    quest, 

    rutaServ = 'http://pizarra.debbie.com.mx/',

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

       
       $('body').scrollTo(target);

       if (md.mobile()) {
          $('html,body').animate({ scrollTop: 500},'fast');
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

        var $cor = notEmail($('.mlwEmail').val());
        $('.mlwEmail').toggleClass('error', $cor);
        if (!$('#terms').is(':checked') || $cor)
          flag = false;

        $(document).off('scroll');
        pagination.fadeOut('fast');

        if (flag) {
          var datos = $('#datosRegistro').serialize();
          
          $.post(rutaServ + 'trivia/registro', datos, function (data) {

            if (data.status == 1) {
              $('#btnFacebook').fadeOut('fast');
              quest = { 'quest' : data.quest };
              //window.parent.registro();
              $slids.fadeOut(500, function () {
                $('[class^="o-form"]').filter('.active').removeClass('active');
                $('.o-control').filter('.active').removeClass('active');
                $.post(rutaServ + 'trivia/quiz', quest, function (data) {
                  $('.slide2').fadeIn('slow');
                  $('#quizimage p').html(data.cuest);
                  $('.o-form__file').addClass('active');
                  $('.o-control.subir').addClass('active');
                },'json');
              });
            } else {
              $('.primero .mensaje').fadeIn('fast').html(data.mensage);
              $('.mlwEmail').toggleClass('error', data.status == 2);
              setTimeout(function () {
                $('.primero .mensaje').fadeOut('slow');
              }, 15000);
            }
          }, "json").done(function (data) {
          }).fail(function (e) {
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

      $('.subirlo').click(function () {
        var $file = $('#puzzle');

        if ($file.val() == '') {
          $file.addClass('error');
        } else {
          var file_data = $file.prop('files')[0];
          var form_data = new FormData();
          form_data.append('puzzle', file_data);
          form_data.append('quest', quest.quest);

          $('[class^="o-form"]').filter('.active').removeClass('active');
          $('.o-control').filter('.active').removeClass('active');
          $('.slide2').fadeOut(500);

          $.ajax({
            url: rutaServ + 'trivia/imagen',
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (data) {
              if (data.status == 1) {
                $.post(rutaServ + 'trivia/quiz', quest, function (data) {
                  $('.mlw_qmn_question').html(data.cuest);
                  $('.o-form__quest').addClass('active');
                  $('.o-control.segundo').addClass('active');
                }, 'json').done(function (e) {
                  $('#quizDatos').show();
                  $('.answer_open_text').focus();
                  $('.slide3').fadeIn('slow');
                }).fail(function (e) {
                  $('.subir .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
                  setTimeout(function () {
                    $('.subir .mensaje').fadeOut('slow');
                  }, 15000);
                });
              }
            }
          }).fail(function (e) {
            $('.segundo .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
            setTimeout(function () {
              $('.segundo .mensaje').fadeOut('slow');
            }, 15000);
          });
        }
      });
      
      $('.nexxt').click(function () {
        var $text = $('.answer_open_text');
        if ($text.val() == '') {
          $text.addClass('error');
        } else {
          $text.removeClass('error');
          var anws = { 'quest' : quest.quest, 'anws' : $('.answer_open_text').val() };
          $.post(rutaServ + 'trivia/answ', anws, function (data) {
            if (data.status == 1) {
              $('.slide3').fadeOut(500, function () {
                $.post(rutaServ + 'trivia/quiz', quest, function (data) {
                  if(data.status == '2'){
                    $('[class^="o-form"]').filter('.active').removeClass('active');
                    $('.o-form__thanks').addClass('active');
                    $('.formulario').addClass('salida');
                    $('.o-control').filter('.active').removeClass('active');
                    //window.parent.termina();
                  } else {
                    $('.mlw_qmn_question').html(data.cuest);
                    $text.val('').focus();
                    $('.slide3').fadeIn('slow');
                  }
                },'json').done(function (data) {
                }).fail(function (e) {
                  $('.segundo .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
                  setTimeout(function () {
                    $('.segundo .mensaje').fadeOut('slow');
                  }, 15000);
                });
              });
            }
          }, 'json').fail(function (e) {
            $('.segundo .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
            setTimeout(function () {
              $('.segundo .mensaje').fadeOut('slow');
            }, 15000);
          });
          
        }

      });
    },

    loadForms = function () {
    };
  var $con = 0;
  function notEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return !regex.test(email);
  }

  // public API
  return {
    init: init,
    loadForms: loadForms,
    setHash : setHash,
    hashChange : hashChange
  }

})(window, jQuery);

