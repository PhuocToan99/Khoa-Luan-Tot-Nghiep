$(document).ready(function(){
    //ES6 'let' loop yo
    for (let i = 1; i < 6; i++) {
      $('.link' + i).click( function(){
        $('.links').removeClass('active');
        $('.pages').removeClass('active');
        $('.link'+i).addClass('active');
        $('.page'+i).addClass('active');
      });
    }
    //does this for every .links div on the left side and every 'continue' or 'go back' button with the same classes
  });