$(function() {

  /** Get and Display all Playlists ***/
  function displayAllPlaylists() {
    $.get("api/playlist")
      .done(function(response){
        $.each(response.data, function(key,value){
          displayPlaylist(value);
      })
      $('.playlistName').arctext({radius: 120});
      addEventHandlers();
        })
        .fail(()=>{
          $('.mainContent').innerHtml=`
          <h2>No Playists</h2>`;
        })
  }
  displayAllPlaylists();

  function addEventHandlers() {
    $('.deleteBtn').click((e)=>{deletePlaylist(e)});
    $('.editBtn').click((e)=>{updatePlaylist(e)});
    $('.playBtn').click((e)=>{activatePlaylist(e)});
  }

  /**
   * Open Dialog for New Playlist
   */
  $('.new-Playlist-Icon').click(()=>{
    $('.updateInfoBtn').css('display','none')
    $('.next-btn').css('display','inline')

    $('input[name="playlistName"]').val('');
    $('input[name="image"]').val('');
    
    if($('.addSongsFormContainer').is(':empty')) addSongInputs();
    else{
      $('.addSongs').each(function () {
        $(this).find('input[name="url"]').val("");
        $(this).find('input[name="songName"]').val("");
    });
  }
      
    $('.new-PlaylistWrapper').dialog({show: 400,modal: true, width: 500, title:'Add New Playlist'});
    $('.newSongs').hide();
    $('.new-PlaylistContainer').show();

  });

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
    submitPlaylist();
  });
    // $('.new-PlaylistWrapper').dialog('close');
    // $('input').each(function() {
    //   $(this).value = '';
    // })
  // });

  function addSongInputs() {
    let moreSongInputs = `
      <form action="" method="post" class="addSongs">
        <label>Song URL:</label>
        <input type="text" name="url" id="">
        <label> Name:</label>
        <input type="text" name="songName" id="">
      </form>`;
    $('.addSongsFormContainer').append(moreSongInputs);
  }

  $('.addMoreSongs').click(()=>{
    addSongInputs();
  })

  function submitPlaylist(id = null) {
    let data = {};
    data.name = $('input[name="playlistName"]').val();
    data.image = $('input[name="image"]').val();

    /**Update Playlist */
    if(id){
      $.post(`api/playlist/${id}`, data)
        .done(function () {
          $('.addSongsFormContainer').empty()
        })
        .fail(function (data) {
          alert("That's an Error! Something went wrong...");
        }
      );

      /**New Playlist */
    } else {
      data.songs = [];
      $('.addSongs').each(function () {
        let songObj = { "url": `${$(this).find('input[name="url"]').val()}`, "name": `${$(this).find('input[name="songName"]').val()}` };
        data.songs.push(songObj);
      })
      $.post("api/playlist", data)
        .done(function (response) {
          $('.addSongsFormContainer').empty();
          /** onSuccess Append New Playlist*/
          $.get(`api/playlist/${response.data.id}`)
            .done((response)=>{displayPlaylist(response.data)})
        })
        .fail(function (data) {
          console.log(data);
          alert("That's an Error! Something went wrong...");
        }
      );
    }
  }

  function displayPlaylist(getResponse){
    let playlistContainer = document.createElement('div');
    let playlist = document.createElement('div');
    let albumTitle = document.createElement('div');
    let editBtn = document.createElement('span');
    let deleteBtn = document.createElement('span');
    let playBtn = document.createElement('div');

    deleteBtn.classList.add('deleteBtn')
    deleteBtn.innerHTML = `<i class="fas fa-times"></i>`;
    editBtn.classList.add('editBtn')
    editBtn.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
    playBtn.classList.add('playBtn')
    playBtn.innerHTML = `<i class="far fa-play-circle"></i>`;

    playlistContainer.classList.add(`albumContainer${getResponse.id}`);
    playlist.classList.add('albumWrapper');
    playlist.id = getResponse.id;
    albumTitle.classList.add('playlistName');
    albumTitle.textContent = getResponse.name;
    $('.playlistName').arctext({radius: 110});
    playlist.style.backgroundImage = `url(${getResponse.image})`;
    playlist.append(albumTitle, deleteBtn, editBtn, playBtn);
    playlistContainer.append(playlist);
    $('.mainContent').append(playlistContainer);
  }

  function deletePlaylist(e) {
    let ID = e.currentTarget.parentElement.id;
    $('.dialogBox').dialog({show: 400, modal: true, width: 300, title:"Are You Sure?", 
          buttons: [{
            text: "Yes",
            click: function() {
              $.ajax({
                method: "DELETE",
                url:`api/playlist/${ID}`})
                .done(function(){
                  $('.dialogBox').dialog({show: 300,modal: true, width: 300, title:`${e.currentTarget.previousElementSibling.innerText} Playlist Deleted`,
                    buttons: [{
                      text: "OK",
                      click: function() {
                        $('.dialogBox').dialog( "close" )
                      }}]
                    })
                    $(`.albumContainer${ID}`).remove();
                });
            $('.dialogBox').dialog( "close" );
          }
          },
          {
            text: "Cancel",
            click: function(){
              $('.dialogBox').dialog( "close" );
              $('.dialogBox').empty();
            }
          }]
        }); 
  }

  function updatePlaylist(e) {
    event.stopPropagation();
    let id = e.currentTarget.parentElement.id;
    let name = e.currentTarget.previousElementSibling.previousElementSibling.innerText;
    $.get(`api/playlist/${id}`)
      .done((response)=>{
        $('input[name="playlistName"]').val(name);
        $('input[name="image"]').val(response.data.image);
        $('.new-PlaylistWrapper').dialog({width: 600, modal: true, title:`Update ${name} Playlist`});
        $('.next-btn').css('display','none')
        $('.updateInfoBtn').css('display','inline-block')
        $('.updateInfoBtn').click(function(){
          event.preventDefault();
          submitPlaylist(id);

          displayUpdateSongs(id, name);
        
        });
      })
  }

  function displayUpdateSongs(id, name) {
    $('.addSongsFormContainer').empty();
        $.get(`api/playlist/${id}/songs`)
          .done(function(response){
            let songs = response.data.songs;
            console.log(songs);
            songs.forEach(function(song) {
              console.log(song);
              addSongInputs();
              $('input[name="url"]').val(song.url); $('input[name="songName"]').val(song.name);
            })
    
            /**Show Playlist Songs Form */
            $('.submitNewPlaylist').css('display','none')
            $('.updateSongsBtn').css('display','inline')
            $('.new-PlaylistContainer').hide("fade", 500, ()=>{
              $('.new-PlaylistWrapper').dialog({width: 600, modal: true, title:`Update ${name} Playlist Songs`});
              $('.newSongs').show("fade", 500);
              });

            $('.updateSongsBtn').unbind().click(() => {
              event.preventDefault();
              let songs = [];
              $('.addSongs').each(function () {
                let songObj = { "url": `${$(this).find('input[name="url"]').val()}`, "name": `${$(this).find('input[name="songName"]').val()}` };
                songs.push(songObj);
              })
              $.post(`api/playlist/${id}/songs`, songs)
                .done(()=>{
                  $('.new-PlaylistWrapper').dialog('close');
                  $('.addSongsFormContainer').empty();
                })
            });
          })
  }

  

  function activatePlaylist(e) {
    $('source').attr("src", '');
    $('.songList').empty();
    $('.activeImage').css('backgroundImage', `${e.currentTarget.parentElement.style.backgroundImage}`);
    $('.activePlaylistWrapper').css('display', 'flex');
    $('.activePlaylistWrapper').show('fade', 300);
    let audio = $('audio').attr('preload','auto');
    
    $.get(`api/playlist/${e.currentTarget.parentElement.id}/songs`)
      .done((response)=>{
        songs = response.data.songs;
        $('source').attr("src", songs[0].url);
        audio[0].pause();
        audio[0].load();
   
        audio[0].oncanplaythrough = audio[0].play();
        songs.forEach(function(song) {
          $('.songList').append(`<p>${song.name}</p>`)
          
        })

      })

  }








});