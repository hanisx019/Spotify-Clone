let currentSong = new Audio();
let playSong = document.getElementById("play");
let timer;
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
  return songs;
}

function formatTime(time,duration) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');


  const mins1 = Math.floor(duration / 60);
  const secs1 = Math.floor(duration % 60);
  const formattedMins1 = String(mins1).padStart(2, '0');
  const formattedSecs1 = String(secs1).padStart(2, '0');


  time =`${formattedMins}:${formattedSecs}`
  duration =`${formattedMins1}:${formattedSecs1}`


  console.log(time,duration);
  document.querySelector(".song-duration").innerHTML=`${time}/${duration}`
}


function playMusic(track) {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  currentSong.play();
  playSong.src="/img/pause.svg"
  document.querySelector(".song-info").innerHTML = track.split("- PagalWorld.mp3")[0];
  document.querySelector(".song-duration").innerHTML=`${timer}`;
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

    currentSong.addEventListener("timeupdate",()=>{
      let cr=currentSong.currentTime;
      let dr=currentSong.duration;
      let time=Math.floor(cr+1)
      let duration=Math.floor(dr+1)
      // console.log(time,duration);
      formatTime(time,duration);
  })

  
    currentSong.addEventListener("loadedmetadata",()=>{
      let cr=currentSong.currentTime;
      let dr=currentSong.duration;
      let time=Math.floor(cr+1)
      let duration=Math.floor(dr+1)
      // console.log(time,duration);
      formatTime(time,duration);
  })

}

main();
