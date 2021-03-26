$(document).ready(function(){
  for (let i = 1; i < 6; i++) {
     $('#show'+i).click(function() {
      $('.menu' +i).toggle("slide");
    });     
    }
 });