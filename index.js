let currentSong = new Audio();
let playSong = document.getElementById("play");
let timer;
let songs;
let currFolder;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let data = await a.text();
  let div = document.createElement("div");
  div.innerHTML = data;

  let b = div.querySelectorAll("a");

  songs = [];
  // let shortSongs = [];
  for (let i = 0; i < b.length; i++) {
    if (b[i].href.endsWith("mp3")) {
      songs.push(b[i].href.split(`${folder}`)[1]);
    }
  }
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (let song of songs) {
    songUL.innerHTML += `
    <li>
     <div class="d1"><img id="p1" class="invert" src="/img/music-solid-24.png"/></div>
     <div class="d2" id="d">${song.replaceAll("%20", " ")}</div>
     <div class="d3">Play Now</div>
     <div class="d4"><img id="p2" class="invert" src="/img/play-circle-regular-24.png"></div>
     </li>
    `;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.firstElementChild.nextElementSibling.innerHTML);
      playMusic(e.firstElementChild.nextElementSibling.innerHTML);
    });
  });
}

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

  console.log(time, duration);
  document.querySelector(".song-duration").innerHTML = `${time}/${duration}`;
}

function playMusic(track, pause = false) {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `${currFolder}` + track;
  if (!pause) {
    currentSong.play();
    playSong.src = "/img/pause.svg";
  }
  document.querySelector(".song-info").innerHTML =
    decodeURI(track).split("- PagalWorld.mp3")[0];
  document.querySelector(".song-duration").innerHTML = `${timer}`;
}
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let data = await a.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let data = await a.json();
      console.log(data);
      let groups = document.getElementById("main");
      console.log("groups");
      groups.innerHTML =
        groups.innerHTML +
        `
      <div data-folder="${folder}" class="box" id="card"> 
          <div class="play"><img src="/img/roundplay.svg" /></div>
          <img src="songs/${folder}/cover.jpeg"  />
          <h2>${data.title}</h2>
          <p>${data.description}</p>
      </div> 
      `;
    }
  }
  //load playlist
  Array.from(document.querySelectorAll(".box")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
async function main() {
  await getSongs("songs/folder1");
  playMusic(songs[0], true);

  //albums display
  displayAlbums();

  playSong.addEventListener("click", () => {
    if (!currentSong.src) {
      playSong.src = "/img/play.svg";
    } else if (currentSong.paused) {
      currentSong.play();
      playSong.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      playSong.src = "/img/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    let cr = currentSong.currentTime;
    let dr = currentSong.duration;
    let time = Math.floor(cr + 1);
    let duration = Math.floor(dr + 1);
    // console.log(time,duration);
    formatTime(time, duration);

    let c1 = (document.querySelector(".circle").style.left =
      (time / duration) * 100 + "%");
    console.log(c1);
  });

  currentSong.addEventListener("loadedmetadata", () => {
    let cr = currentSong.currentTime;
    let dr = currentSong.duration;
    let time = Math.floor(cr + 1);
    let duration = Math.floor(dr + 1);
    // console.log(time,duration);
    formatTime(time, duration);
  });

  //add event listner to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.getElementById("menu").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
  });

  document.getElementById("previous").addEventListener("click", () => {
    console.log(currentSong);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //mute button

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("/img/volume.svg")) {
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
}

main();
