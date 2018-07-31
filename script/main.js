$(function() {

  $('.new-Playlist-Icon').click(()=>{
    $('.new-PlaylistWrapper').dialog({modal: true, width: 500});
    $('.newSongs').hide();
    $('.new-PlaylistContainer').show();

  })

  $('.next-btn').click(()=>{
    event.preventDefault();
    $('.new-PlaylistContainer').hide("fade", 500, ()=>{
      $('.newSongs').show("fade", 500);
    });
  });

  $( ".submitNewPlaylist" ).click(()=>{
    event.preventDefault();
    let data ={};
    data.name = $('input[name="playlistName"]').val();
    data.image = $('input[name="image"]').val();
    data.songs = [];
    $('.addSongs').each(()=>{
      let songObj = {"url":`${$('input[name="url"]').val()}`, "name":`${$('input[name="songName"]').val()}`};
      data.songs.push(songObj);
    })
    // let getData = {'type': 'playlist'};
    // $.get('api/playlist.php', getData.serialize());
    let post = $.post("api/playlist.php", data);
    post.done(()=>{
      alert('Posted!!');
    });
    $('.new-PlaylistWrapper').dialog();
  });

  $('addMoreSongs').click(()=>{
    let moreSongInputs = `
      <form action="" method="post" class="addSongs">
        <label>Song URL</label>
        <input type="text" name="url" id="">
        <label> Name</label>
        <input type="text" name="songName" id="">
      </form>`;
    $('addSongsFormContainer').append(moreSongInputs);
  })










});