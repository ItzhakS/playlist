$(function() {


  // let songsSearchArray = [];

  $('input.search-Input').keyup(search);
  function search(){
    let input = $('input.search-Input').val().toLowerCase();
    let playlists = $('.playlistName').toArray();
    console.log(input, playlists);

    playlists.forEach((playlist)=>{
      let text = playlist.innerText;
      console.log(playlist, text);
      if(text.toLowerCase().indexOf(input) == -1){
        playlist.parentElement.parentElement.style.display = 'none';
      }
      else{
        playlist.parentElement.parentElement.style.display = '';
      }
    })
    
  }

  /** Get and Display all Playlists ***/
  function displayAllPlaylists() {
    $.get("api/playlist")
      .done(function(response){
        $.each(response.data, function(key,value){
          // songsSearchArray.push(value.name);
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
    console.log('appemededdd!!!!!!')
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
          console.log('empty songs form')
          /** onSuccess Append New Playlist*/
          $.get(`api/playlist/${response.data.id}`)
            .done((response)=>{
              $('.new-PlaylistWrapper').dialog('close');
              displayPlaylist(response.data);
              addEventHandlers();
            })
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
                .done(function(res){
                  $('.dialogBox').dialog({show: 300,modal: true, width: 300, title:`Playlist Deleted`,
                    buttons: [{
                      text: "OK",
                      click: function() {
                        $('.dialogBox').dialog( "close" )
                      }}]
                    })
                    $(`.albumContainer${ID}`).remove();
                    if($('.activePlaylistBtns').attr('id') == ID){
                      closeActivePlaylist();
                    }
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

  function closeActivePlaylist(){
    $('.activePlaylistWrapper').hide();
  }

  function updatePlaylist(e) {
    event.stopPropagation();
    let id = e.currentTarget.parentElement.id;
    // let name = e.currentTarget.previousElementSibling.previousElementSibling.innerText;
    $.get(`api/playlist/${id}`)
      .done((response)=>{
        $('.addSongsFormContainer').empty();
        console.log('empty songs form', response)
        $('.newSongs').hide();
        $('input[name="playlistName"]').val(response.data.name);
        $('input[name="image"]').val(response.data.image);
        $('.new-PlaylistContainer').show()
        $('.new-PlaylistWrapper').dialog({width: 600, modal: true, title:`Update ${response.data.name} Playlist`});
        $('.next-btn').css('display','none')
        $('.updateInfoBtn').css('display','inline-block')
        $('.updateInfoBtn').unbind().click(function(){
          event.preventDefault();
          submitPlaylist(id);

          displayUpdateSongs(id, name);
        
        });
      })
  }

  function displayUpdateSongs(id, name) {
    $('.addSongsFormContainer').empty();
    console.log('empty songs form')

        $.get(`api/playlist/${id}/songs`)
          .done(function(response){
            let songs = response.data.songs;
            console.log(songs);
            songs.forEach(function(song, i) {
              console.log(song);
              addSongInputs();
              console.log($('input[name="url"]'));
              $('input[name="url"]')[i].value =song.url; $('input[name="songName"]')[i].value = song.name;
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
              let data = {'songs': songs};
              $.post(`api/playlist/${id}/songs`, data)
                .done(()=>{
                  $('.new-PlaylistWrapper').dialog('close');
                  $('.addSongsFormContainer').empty();
                  console.log('empty songs form');
                  $('.mainContent').empty();
                  displayAllPlaylists();
                })
            });
          })
  }

  function activatePlaylist(e) {
    $('source').attr("src", '');
    $('.songList').empty();
    $('.songList').append("<ol></ol>");
    $('.activeImage').css('backgroundImage', `${e.currentTarget.parentElement.style.backgroundImage}`);
    $('.activePlaylistWrapper').css('display', 'flex');
    $('.activePlaylistWrapper').show('fade', 300);
    $('.activePlaylistBtns').attr('id', e.currentTarget.parentElement.id );
    // $('audio').empty();
    let audio = $('audio').attr('preload','auto');
    
    $.get(`api/playlist/${e.currentTarget.parentElement.id}/songs`)
      .done((response)=>{
        let counter = 1;
        songs = response.data.songs;
        
        // songs.forEach((song)=>{
          //   let source = document.createElement('source');
          //   let src = document.createAttribute('src');
          //   src.value = `${song.url}`;
          //   source.setAttributeNode(src);
          //   audio.append(source)
          // })
        $('source').attr("src", songs[0].url);
        audio[0].pause();
        audio[0].load();
        audio[0].oncanplaythrough = audio[0].play();
        audio[0].addEventListener('ended', () => {
          console.log('endede!');
          console.log(counter == songs.length);
          if(counter == songs.length){
            audio[0].firstElementChild.src = songs[0].url;
            let playBtn = $('.fa-play');
            playBtn.hide();
            $(`span.song0`).append('<i class="fa fa-play fa-1"></i>');
            audio[0].load();
            audio[0].oncanplaythrough = audio[0].play();
          } else {
            audio[0].firstElementChild.src = songs[counter].url;
            let playBtn = $('.fa-play');
            playBtn.hide();
            $(`span.song${counter}`).append('<i class="fa fa-play fa-1"></i>');
            audio[0].load();
            audio[0].oncanplaythrough = audio[0].play();
            counter++;
            console.log(counter);
          }
        })
        songs.forEach(function(song, i) {
          if (i<1) $('.songList ol').append(`<li class="song${i}"><span class="song${i}"><i class="fa fa-play fa-1"></i></span><span class="songName">${song.name}</span></li>`);
          else $('.songList ol').append(`<li class="song${i}"><span class="song${i}"></span><span class="songName">${song.name}</span></li>`);   
        })
      })
  }

  $('.activePlaylistDelete').click((e)=>{deletePlaylist(e)})
  $('.activePlaylistUpdate').click((e)=>{updatePlaylist(e); console.log('HERERERERERER');})








});