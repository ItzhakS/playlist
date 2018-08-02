$(function() {

  /** Get and Display all Playlists ***/
  $.get("api/playlist.php", {type:'playlist'})
    .done(function(response){
      $.each(response.data, (key, value)=>{
        let playlist = document.createElement('div');
        playlist.classList.add('albumWrapper');
        playlist.innerHTML = `
        <h3 class="playlistName">${value.name}</h3>
        <img class="albumArtwork" src="${value.image}" alt="Album Artwork">
        `;
        $('.mainContent').append(playlist);
        })
      })

  /**
   * Open Dialog for New Playlist
   */
  $('.new-Playlist-Icon').click(()=>{
    $('.new-PlaylistWrapper').dialog({modal: true, width: 500, title:'Add New Playlist'});
    $('.newSongs').hide();
    $('.new-PlaylistContainer').show();

  })

  /**
   * Switch Between Playlist to Songs container 
   */
  $('.next-btn').click(()=>{
    event.preventDefault();
    $('.new-PlaylistContainer').hide("fade", 500, ()=>{
      $('.new-PlaylistWrapper').dialog({width: 600, title:'Add Playlist Songs'});
      $('.newSongs').show("fade", 500);
    });
  });

  /**
   * Submit New Playlist
   */
  $( ".submitNewPlaylist" ).click(()=>{
    event.preventDefault();
    let data ={};
    data.name = $('input[name="playlistName"]').val();
    data.image = $('input[name="image"]').val();
    data.songs = [];
    $('.addSongs').each(function() {
      let songObj = {"url":`${$(this).find('input[name="url"]').val()}`, "name":`${$(this).find('input[name="songName"]').val()}`};
      data.songs.push(songObj);
    })
    $.post("api/playlist.php?type=playlist", data)
      .done(function(response) {
        /** onSuccess Append New Playlist*/
        $.get("api/playlist.php",{type:'playlist', id:`${response.data.id}`})
          .done(displayNewPlaylist(getResponse))
      })
      .fail(function(data) {
        alert("That's an Error! Your playlist was not saved.");
      });
    $('.new-PlaylistWrapper').dialog('close');
    $('input').each(function() {
      $(this).value = '';
    })
  });

  function displayNewPlaylist(getResponse){
    let playlist = document.createElement('div');
    playlist.classList.add('albumWrapper');
    playlist.style.backgroundImage = `url(${getResponse.data.image})`
    playlist.innerHTML = `
    <h3 class="playlistName">${getResponse.data.name}</h3>
    `;
    $('.mainContent').append(playlist);
  }

  $('.addMoreSongs').click(()=>{
    let moreSongInputs = `
      <form action="" method="post" class="addSongs">
        <label>Song URL:</label>
        <input type="text" name="url" id="">
        <label> Name:</label>
        <input type="text" name="songName" id="">
      </form>`;
    $('.addSongsFormContainer').append(moreSongInputs);
  })










});