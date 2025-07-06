let currentSong = new Audio();

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
      // shortSongs.push(b[i].href.split("/songs/")[1]);
      songs.push(b[i].href.split("/songs/")[1]);
    }
  }
  // return { songs, shortSongs };
  return songs;
}

function playMusic(track) {
  // let audio = new Audio("/songs/" + track);
  currentSong.src="/songs/" + track;
  currentSong.play();
}

async function main() {
  // let { songs, shortSongs } = await getSongs();
  let songs = await getSongs();
  // console.log(songs);

  // let play = document.getElementById("bt");
  // console.log(play);

  // play.addEventListener("click", () => {
  //   var audio = new Audio(songs[4]);
  //   console.log(audio);
  //   audio.play();

  //   play.addEventListener("dblclick", () => {
  //     audio.pause();
  //   });

  //   audio.addEventListener("loadedmetadata", () => {
  //     let duration = audio.duration;
  //     console.log(duration);
  //   });
  // });

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

  Array.from(document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.firstElementChild.nextElementSibling.innerHTML);
      playMusic(e.firstElementChild.nextElementSibling.innerHTML);
    });
  });
}
main();
