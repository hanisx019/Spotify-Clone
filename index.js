let currentSong = new Audio();
let playSong = document.getElementById("play");
async function getSongs() {

  let a = await fetch("http://127.0.0.1:3000/songs/");
  let data = await a.text();
  // console.log(data);


  let div = document.createElement("div");
  div.innerHTML = data;
  // console.log(div);


  let b = div.querySelectorAll("a");
  // console.log(b);


  let songs = [];
  // let shortSongs = [];
  for (let i = 0; i < b.length; i++) {
    if (b[i].href.endsWith("mp3")) {
      songs.push(b[i].href.split("/songs/")[1]);
    }
  }
  // return { songs, shortSongs };
  return songs;
}


function playMusic(track) {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  currentSong.play();
  playSong.src="/img/pause.svg"
}

async function main() {
  let songs = await getSongs();

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
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
}

main();
