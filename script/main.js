$(function() {

  /** Get and Display all Playlists ***/
  $.get("api/playlist.php", {type:'playlist'})
    .done(function(response){
      $.each(response.data, function(key,value){
      let playlistContainer = document.createElement('div');
      let playlist = document.createElement('div');
      let albumTitle = document.createElement('div');
      playlistContainer.classList.add('albumContainer');
      playlist.classList.add('albumWrapper');
      albumTitle.classList.add('playlistName');
      albumTitle.textContent = value.name;
      $('.playlistName').arctext({radius: 120});
      playlist.style.backgroundImage = `url(${value.image})`;
      playlist.append(albumTitle);
      playlistContainer.append(playlist);
      $('.mainContent').append(playlistContainer);
    })
    $('.playlistName').arctext({radius: 120});
    
      })
      .fail(()=>{
        $('.mainContent').innerHtml=`
        <h2>No Playists</h2>`;
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
          .done(displayNewPlaylist(getResponse.data))
      })
      .fail(function(data) {
        alert("That's an Error! Your playlist was not saved.");
      });
    $('.new-PlaylistWrapper').dialog('close');
    $('input').each(function() {
      $(this).value = '';
    })
  });

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

  function displayNewPlaylist(getResponse){
    let playlistContainer = document.createElement('div');
    let playlist = document.createElement('div');
    let albumTitle = document.createElement('div');
    playlistContainer.classList.add('albumContainer');
    playlist.classList.add('albumWrapper');
    albumTitle.classList.add('playlistName');
    albumTitle.textContent = getResponse.name;
    $('.playlistName').arctext({radius: 120});
    playlist.style.backgroundImage = `url(${getResponse.image})`;
    playlist.append(albumTitle);
    playlistContainer.append(playlist);
    $('.mainContent').append(playlistContainer);
  }

  function deletePlaylist(e) {
    $.ajax({
      method: "DELETE",
      url:`api/playlist/${id}`})      
    
  }










});