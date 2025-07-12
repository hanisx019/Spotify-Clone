let currentSong = new Audio();
let playSong = document.getElementById("play");
let timer;
let songs;
let currFolder;

//function for getting songs//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`${folder}/songs.json`);
  let data = await a.json();

  songs = data.map(song => "/" + song);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (let song of songs) {
    songUL.innerHTML += `
    <li>
     <div class="d1"><img id="p1" class="invert" src="img/music-solid-24.png"/></div>
     <div class="d0" id="d0">${song.replaceAll("%20", " ")}</div>
     <div class="d2" id="d">${song
       .replaceAll("%20", " ")
       .replaceAll("/", " ")
       .replaceAll("- PagalWorld.mp3", " ")}</div>
     <div class="d3">Play Now</div>
     <div class="d4"><img id="p2" src="img/spotplay.svg"></div>
     </li>
    `;
  }
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, i) => {
    e.addEventListener("click", () => {
      playMusic(songs[i]);
    });
  });
  return songs;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function for converting time to 00:00/00:00 format////////////////////////////////////////////////////////////////////////////

function formatTime(time, duration) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  const mins1 = Math.floor(duration / 60);
  const secs1 = Math.floor(duration % 60);
  const formattedMins1 = String(mins1).padStart(2, "0");
  const formattedSecs1 = String(secs1).padStart(2, "0");

  time = `${formattedMins}:${formattedSecs}`;
  duration = `${formattedMins1}:${formattedSecs1}`;

  document.querySelector(".song-duration").innerHTML = `
  <div class="st">${time}</div>
  <div class="et">${duration}</div>
  `;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function playMusic(track, pause = false) {
  currentSong.src = `${currFolder}` + track;
  if (!pause) {
    currentSong.play();
    playSong.src = "img/pauseu.svg";
  }

  let abd = decodeURI(track).split("- PagalWorld.mp3")[0];
  document.querySelector(".song-info").innerHTML = abd.split("/")[1];

  document.querySelector(".song-duration").innerHTML = `${timer}`;
}

//function for dynamic playlist////////////////////////////////////////////////

async function displayAlbums() {
  let a = await fetch(`songs/`);
  let data = await a.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let anchors = div.getElementsByTagName("a");
  // let cardContainer = document.querySelector(".box");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`songs/${folder}/info.json`);
      let data = await a.json();

      let groups = document.getElementById("main");

      groups.innerHTML =
        groups.innerHTML +
        `
      <div data-folder="${folder}" class="box" id="card"> 
          <div class="play"><img src="img/spotplay.svg" /></div>
          <img src="songs/${folder}/cover.jpeg"  />
          <h2>${data.title}</h2>
          <p>${data.description}</p>
      </div> 
      `;
    }
  }
  //load playlist whenver card is clicked
  Array.from(document.querySelectorAll(".box")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

///////////////////////////////////////////////////////////////////////////

/////////////////////////////function main ///////////////////////////////

async function main() {
  await getSongs("songs/folder1");
  playMusic(songs[0], true);

  //albums display
  displayAlbums();

  playSong.addEventListener("click", () => {
    if (!currentSong.src) {
      playSong.src = "img/playu.svg";
    } else if (currentSong.paused) {
      currentSong.play();
      playSong.src = "img/pauseu.svg";
    } else {
      currentSong.pause();
      playSong.src = "img/playu.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    let cr = currentSong.currentTime;
    let dr = currentSong.duration;
    let time = Math.floor(cr + 1);
    let duration = Math.floor(dr + 1);

    formatTime(time, duration);

    let c1 = (document.querySelector(".circle").style.left =
      (time / duration) * 100 + "%");
  });

  currentSong.addEventListener("loadedmetadata", () => {
    let cr = currentSong.currentTime;
    let dr = currentSong.duration;
    let time = Math.floor(cr + 1);
    let duration = Math.floor(dr + 1);

    formatTime(time, duration);
  });

  //add event listner to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //


  // Hamburger Functionality

  let xa = document.querySelector(".hamburger");
  xa.addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  let xb = document.querySelector(".cross");
  xb.addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
  });

  //


  //

  // add an event to previous
  // previous.addEventListener("click", () => {
  //   currentSong.pause()
  //   console.log("previous button clicked")
  //   let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  //   console.log(index)
  //   if ((index - 1) >= 0) {
  //     playMusic(songs[index - 1]);
  //   }
  // });

  // next.addEventListener("click", () => {
  //   currentSong.pause()
  //   console.log("next button clicked")
  //   let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  //   console.log(index)
  //   if (index + 1 < songs.length) {
  //     playMusic(songs[index + 1]);
  //   }
  // });

  //

  // Previous Song Button

  previous.addEventListener("click", () => {
    // currentSong.pause();
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.findIndex(
      (song) => decodeURIComponent(song.split("/").pop()) === currentFile
    );
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });
  //

  //Next Song Button

  next.addEventListener("click", () => {
    // currentSong.pause();
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.findIndex(
      (song) => decodeURIComponent(song.split("/").pop()) === currentFile
    );
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //

  // Volume Button Function

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //

  //Mute Button function///////////////

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 10;
    }
  });


  //


}

main();
