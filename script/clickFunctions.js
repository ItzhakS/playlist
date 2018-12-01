function pausePlay(){
  if($('audio')[0].paused){
    $('audio')[0].play();
    $('.activeImage').empty();
    $('.activeImage').append('<i class="fas fa-pause pause"></i>');

  }
  else{
    $('audio')[0].pause();
    $('.activeImage').empty();
    $('.activeImage').append('<i class="fa fa-play activePlay fa-1"></i>');
  }
}

function playEvent(){
  $('.activeImage').empty();
    $('.activeImage').append('<i class="fas fa-pause pause"></i>');
}
function pauseEvent(){
  $('.activeImage').empty();
    $('.activeImage').append('<i class="fa fa-play activePlay fa-1"></i>');
}