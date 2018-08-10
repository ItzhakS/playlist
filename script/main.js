$(function() {

  /** Get and Display all Playlists ***/
  function displayAllPlaylists() {
    $.get("api/playlist.php", {type:'playlist'})
      .done(function(response){
        $.each(response.data, function(key,value){
          displayPlaylist(value);
      })
      $('.playlistName').arctext({radius: 110});
        })
        .fail(()=>{
          $('.mainContent').innerHtml=`
          <h2>No Playists</h2>`;
        })
  }
  displayAllPlaylists();

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
    submitPlaylist();
  });
    // $('.new-PlaylistWrapper').dialog('close');
    // $('input').each(function() {
    //   $(this).value = '';
    // })
  // });

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

  function submitPlaylist(e) {
    let data = {};
    data.name = $('input[name="playlistName"]').val();
    data.image = $('input[name="image"]').val();
    // return data;
    if(e){
      $.post(`api/playlist/${e.currentTarget.parentElement.id}`, data)
    }
    else {
      data.songs = [];
      $('.addSongs').each(function () {
        let songObj = { "url": `${$(this).find('input[name="url"]').val()}`, "name": `${$(this).find('input[name="songName"]').val()}` };
        data.songs.push(songObj);
      })
      $.post("api/playlist", data)
        .done(function (response) {
          /** onSuccess Append New Playlist*/
          $.get(`api/playlist/${response.data.id}`)
            .done(displayPlaylist(response.data))
        })
        .fail(function (data) {
          alert("That's an Error! Your playlist was not saved.");
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
    $('.deleteBtn').click((e)=>{deletePlaylist(e)});
    $('.editBtn').click((e)=>{updatePlaylist(e)});
    $('.playBtn').click((e)=>{activatePlaylist(e)});
  }

  function deletePlaylist(e) {
    let ID = e.currentTarget.parentElement.id;
    $('.dialogBox').dialog({modal: true, width: 300, title:"Are You Sure?", 
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
            }
          }]
        }); 
    
  }

  function updatePlaylist(e) {
    submitPlaylist(e);

    $.ajax({
      url: '/playlist/api/playlist/1',
      type: 'POST',
      data:{image:"Docs/dvd-image.png"},
      success: function(result) {
          console.log("Success");
      }
    });
  }

  function updateSongs(id) {
    data.songs = [];
      $('.addSongs').each(function () {
        let songObj = { "url": `${$(this).find('input[name="url"]').val()}`, "name": `${$(this).find('input[name="songName"]').val()}` };
        data.songs.push(songObj);
      })
  }

  function activatePlaylist(e) {
    
  }








});