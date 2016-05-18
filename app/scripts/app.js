 var Parallax = (function () {

    var cover = document.querySelector('.o-detail__cover'),
      overview = document.querySelector('.o-detail__overview'),
      maxValue = 0,
      minValue = 1,
      endPoint1 = 0,
      endPoint2 = window.innerHeight - 100,

      updateLayout = function () {
        
      },

      tweener = function () {
        var currentY = window.scrollY,
          proportion = (maxValue - minValue) / (endPoint2 - endPoint1),
          opacity = (currentY - endPoint1) * proportion + minValue,
          posY = ((opacity - minValue) / proportion) + endPoint1;
          
        TweenMax.to(cover, 0.5, { opacity: opacity, y: posY / 3 });
      },

      bind = function () {

        window.addEventListener('resize', function onResize() {
          updateLayout();
        }, false);

        window.addEventListener('scroll', function onScroll() {
          tweener();
        }, false);
      },

      init = function () {

        var md = new MobileDetect(window.navigator.userAgent);

        if (md.mobile()) {
          return false;
        }
        
        bind();
      };

    return { init: init }

  })();
  
var App = (function (window, $) {
  'use strict';

  var quest, 

    rutaServ = 'http://pizarra.debbie.com.mx/',

    init = function () {
      Parallax.init();
      getReady();
    },
    
    getReady = function () {
      $('.modal-body').perfectScrollbar();
      $('a.o-btn-down').click(function(e){
        e.preventDefault();
        $('html, body').stop().animate({
          scrollTop : $('#dinamica').offset().top
        }, 1000);
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
        if (flag) {
          var datos = $('#datosRegistro').serialize();
          $('.primero button').addClass('cargando');
          
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
              $('.primero button').removeClass('cargando');
              $('.primero .mensaje').fadeIn('fast').html(data.mensage);
              $('.mlwEmail').toggleClass('error', data.status == 2);
              setTimeout(function () {
                $('.primero .mensaje').fadeOut('slow');
              }, 15000);
            }
          }, "json").done(function (data) {
          }).fail(function (e) {
            $('.primero button').removeClass('cargando');
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

          $('.subir button').addClass('cargando');

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
                $('[class^="o-form"]').filter('.active').removeClass('active');
                $('.o-control').filter('.active').removeClass('active');
                $('.slide2').fadeOut(500);
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
              } else {
                $('.subir button').removeClass('cargando');
                $('.subir .mensaje').fadeIn('fast').html(data.mensage);
                setTimeout(function () {
                  $('.subir .mensaje').fadeOut('slow');
                }, 15000);
              }
            }
          }).fail(function (e) {
            $('.subir button').removeClass('cargando');
            $('.subir .mensaje').fadeIn('fast').html('Es imposible conectarse con el servidor en este momento, por favor intente mas tarde.');
            setTimeout(function () {
              $('.subir .mensaje').fadeOut('slow');
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
    };
  function notEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return !regex.test(email);
  }

  // public API
  return {
    init: init
  }

})(window, jQuery);

