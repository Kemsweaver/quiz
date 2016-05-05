(function (global) {
  
  'use strict';
  
  var domBody = $('body');
  if(domBody.hasClass('page--home')){
    App.init();
  }
  window.parent.bindHash(function(hash){
    App.setHash(hash);  
  });
  App.hashChange(window.parent.hashChange);
  
})(window);
