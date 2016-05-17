(function (global) {
  
  'use strict';
  
  var domBody = $('body');
  if(domBody.hasClass('page--home')){
    App.init();
  }
  if(typeof window.parent.bindHash === 'function')
    window.parent.bindHash(function(hash){
      App.setHash(hash);
    });

  if(typeof window.parent.hashChange === 'function'){
    App.hashChange(window.parent.hashChange);
  }

})(window);
