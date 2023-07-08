const body = document.querySelector("body");
const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const musicDetails = document.querySelector("#music-details");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const shuffle = document.querySelector("#shuffle");
const musicListTitle  = document.querySelector("#music-list-title");
let playlistNames = [];

if(localStorage.getItem("All Musics")) {
    let storedMusicList = JSON.parse(localStorage.getItem("All Musics"));
    musicList.splice(0, musicList.length)
    for(let music of storedMusicList) {
        musicList.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition))
    }
}

const player = new MusicPlayer(musicList);
window.addEventListener("load", () => {
    localStorage.setItem("musicList", JSON.stringify(player.musicList));
    localStorage.setItem("All Musics", JSON.stringify(player.musicList));
    localStorage.setItem("Liked Songs", JSON.stringify(player.musicList.filter((music) => {return music.condition == "liked"})));

    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
    audio.volume = volumeBar.value / 100;
    setListToAddOptions();
    volume.classList = volumeIcon(volumeBar.value / 100)
});

function setListToAddOptions() {
    if(!(localStorage.getItem("playlistNames")==null)) {
        playlistNames = JSON.parse(localStorage.getItem("playlistNames"));
    }
    
    if(!(playlistNames==null)) {

        const musiclisttitle = document.querySelector("#music-list-title").nextElementSibling;
        const playlists = document.querySelectorAll(".playLists");
        const playlistLength = playlists.length;
        const length = playlistNames.length;

        musiclisttitle.innerHTML = "";
        const all = `<p class="select-list" onclick="selectList(this.innerHTML, true)">All Musics</p>`;
        const favorite = `<p class="select-list" onclick="selectList('Liked Songs', true)"><i class="fa-solid fa-heart" style="color: red"></i> Liked Songs</p>`;
        musiclisttitle.insertAdjacentHTML("beforeend", all);
        musiclisttitle.insertAdjacentHTML("beforeend", favorite);

        for(let i=0; i<length; i++) {
            const htmlml = `<p class="select-list" onclick="selectList(this.innerHTML, true)">${playlistNames[i]}</p>`;
            musiclisttitle.insertAdjacentHTML("beforeend", htmlml);
            for(let j=0; j<playlistLength; j++) {
                const htmlpl = `<div class="playlist-${i}" onclick="addToPlaylist(this, this.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[0].innerHTML, this.parentElement.parentElement.parentElement.parentElement)">${playlistNames[i]}</div>`;
                playlists[j].insertAdjacentHTML("beforeend", htmlpl);
            }
        }
    }
}

function displayMusic(music) {
    document.querySelector('#music-details').setAttribute('songid', `${music.id}`);
    body.style.backgroundImage = "url(img/" + music.img + ")";
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = `img/${music.img}`;
    audio.src = `mp3/${music.file}`;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => { prevMusic(); });

next.addEventListener("click", () => { nextMusic(); });

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
}

const nextMusic = () => {
    player.next();    
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
}

const pauseMusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
    isPlayingNow();
}

const calculateTime = (totalSeconds) => {
    const minute = Math.floor(totalSeconds / 60);
    const second = Math.floor(totalSeconds % 60);
    const updatedSecond = second < 10 ? `0${second}`:`${second}`;
    const sonuc = `${minute}:${updatedSecond}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let muteState = "unmuted";
let defaultValueofVolume = 5;
volume.addEventListener("click", () => {
    if(muteState === "unmuted") {
        audio.muted = true;
        muteState = "muted"
        volume.classList = volumeIcon(0);
        defaultValueofVolume = volumeBar.value
        volumeBar.value = 0;
    } else {
        if (defaultValueofVolume == 0) {
            defaultValueofVolume = 1;
        }

        audio.muted = false;
        muteState = "unmuted";
        volumeBar.value = defaultValueofVolume;
        volume.classList = volumeIcon(volumeBar.value / 100)
        audio.volume = volumeBar.value / 100;
    }
});

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    defaultValueofVolume = value / 100;
    audio.volume = value / 100;

    if(value == 0) {
        audio.muted = true;
        muteState = "muted"
        volume.classList = volumeIcon(value / 100);
    } else {
        audio.muted = false;
        muteState = "unmuted"
        volume.classList = volumeIcon(value / 100);
    }
});

const displayMusicList = (list) => {

    ul.innerHTML = "";
    
    for(i=0; i<list.length; i++) {
        if(list[i].condition=="liked") {
            let liTag = `
                <li li-index="${i}" onclick="selectedMusic(${list[i].id})" class="list-group-item d-flex align-items-center music-list-item">
                    <img src="img/${list[i].img}" alt="">
                    <div class="music-list-info">
                        <span>${list[i].getName()}</span>
                        <span id="music-${i}" class="badge bg-dark rounded-pill float-end">3.21</span>
                        <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
                    </div>
                </li>
                <div class="dropdown">
                    <i class="fa-solid fa-ellipsis-vertical" onclick="showOptions(this.parentElement)"></i>
                    <div class="music-options">
                        <div class="option-1" onclick="dislikeSong('${list[i].id}')"><i class="fa-solid fa-heart"></i>Liked</div>
                        <div class="opt-2">
                            <h6 onclick="this.parentElement.classList.toggle('active')" class="option-2"><img id="a" src="music-list-icon.svg" alt=""> Add to Playlist</h6>
                            <div class="playLists">
                                <div class="new-list" onclick="addNewPlaylist(this)"><i class="fa-solid fa-plus"></i> Add new playlist</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            ul.insertAdjacentHTML("beforeend", liTag);
    
            let liAudioDuration = ul.querySelector(`#music-${i}`);
            let liAudioTag = ul.querySelector(`.music-${i}`);
    
            liAudioTag.addEventListener("loadeddata",()=>{
                liAudioDuration.innerText = calculateTime(liAudioTag.duration);
            });     
        } else {
            let liTag = `
                <li li-index="${i}" onclick="selectedMusic(${list[i].id})" class="list-group-item d-flex align-items-center music-list-item">
                    <img src="img/${list[i].img}" alt="">
                    <div class="music-list-info">
                        <span>${list[i].getName()}</span>
                        <span id="music-${i}" class="badge bg-dark rounded-pill float-end">3.21</span>
                        <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
                    </div>
                </li>
                <div class="dropdown">
                    <i class="fa-solid fa-ellipsis-vertical" onclick="showOptions(this.parentElement)"></i>
                    <div class="music-options">
                        <div class="option-1" onclick="likeSong('${list[i].id}')"><i class="fa-regular fa-heart"></i> Like</div>
                        <div class="opt-2">
                            <h6 onclick="this.parentElement.classList.toggle('active')" class="option-2"><img id="a" src="music-list-icon.svg" alt=""> Add to Playlist</h6>
                            <div class="playLists">
                                <div class="new-list" onclick="addNewPlaylist(this)"><i class="fa-solid fa-plus"></i> Add new playlist</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            ul.insertAdjacentHTML("beforeend", liTag);
    
            let liAudioDuration=ul.querySelector(`#music-${i}`);
            let liAudioTag=ul.querySelector(`.music-${i}`);
    
            liAudioTag.addEventListener("loadeddata",()=>{
                liAudioDuration.innerText = calculateTime(liAudioTag.duration);
            });
        }
    }

    displayMusic(player.getMusic());
    isPlayingNow();
    
}

isClickedtoAddnewPlaylist = false;
const addNewPlaylist = (div) => {

    if(!isClickedtoAddnewPlaylist) {
        div.innerHTML = `
            <div class="input-group-playlist">
                <i class="fa-solid fa-plus" style="position: absolute" onclick="storeNewPlaylist(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[0].innerHTML)"></i>
                <input type="text" id="addPlaylistInput" placeholder="Add new playlist" pattern="[A-Za-z0-9]+">
            </div>
        `;
        isClickedtoAddnewPlaylist = true;
    }
}

const storeNewPlaylist = (musicname) => {
    const listName = document.querySelector("#addPlaylistInput").value;
    const newarr = [];

    if(playlistNames.includes(listName)) {
        alert(`There is already a playlist named '${listName}'. Please enter a different name.`);
        return
    }
    playlistNames.push(listName);

    let storedMusicList = JSON.parse(localStorage.getItem("musicList"));
    for(let music of storedMusicList) {
        if(musicname == (music.title + " - " + music.singer)) {
            newarr.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition));
        }
    }

    localStorage.setItem(listName, JSON.stringify(newarr));
    localStorage.setItem("playlistNames", JSON.stringify(playlistNames));
    window.location.reload()
}

const addToPlaylist = (element, musicName, dropdown) => {
    const listName = element.innerHTML;

    let allMusics = JSON.parse(localStorage.getItem("musicList"));
    let addToThis = JSON.parse(localStorage.getItem(listName));
    for(let music of addToThis) {
        if(musicName == (music.title + " - " + music.singer)) {
            dropdown.classList.remove("active");
            alert("It is already on the list");
            return;
        }
    }
    for(let music of allMusics) {
        if(musicName == (music.title + " - " + music.singer)) {
            addToThis.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition));
        }
    }

    alert(`${musicName} added to ${listName}`)
    localStorage.setItem(listName, JSON.stringify(addToThis));
    dropdown.classList.remove("active");
}

const selectList = (element, isCLick) => {
    const listName = element;
    const newlist = JSON.parse(localStorage.getItem(listName));

    player.musicList = []
    for(let music of newlist) {
        player.musicList.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition))
        player.index = 0;
    }

    musicListTitle.innerHTML = `${listName} <i class="fa-solid fa-caret-down"></i>`;
    if(isCLick) {
        musicListTitle.click();
    }
    shuffle.classList.remove("btn-primary");
    displayMusicList(player.musicList);
    setListToAddOptions();   
}

const selectedMusic = (musicId) => {
    for(let music of player.musicList) {
        if(musicId == music.id) {
            player.index = player.musicList.indexOf(music);
        }
    }
    displayMusic(player.getMusic());
    playMusic();
}

const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")) {
        if(li.classList.contains("playing")) {
            li.classList.remove("playing");
        }

        if(li.children[1].children[0].innerHTML == title.innerHTML) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    next.click();
});

// shuffle option
shuffle.addEventListener("click", () => {

    if(shuffle.classList.contains("btn-primary")) {  // don't shuffle
        let activePlaylist = musicListTitle.innerHTML.slice(0, musicListTitle.innerHTML.length - 39)

        let storedMusicList = JSON.parse(localStorage.getItem(activePlaylist));
        let currentlyPlaying = musicDetails.getAttribute('songid');
        player.musicList = [];

        for(let music of  storedMusicList) {
            if(currentlyPlaying == music.id) {
                player.index = storedMusicList.indexOf(music);
            }
            player.musicList.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition))
        }
        

        shuffle.classList.remove("btn-primary");
    } else { //  shuffle

        for (let i = player.musicList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let k = player.musicList[i];
            player.musicList[i] = player.musicList[j];
            player.musicList[j] = k;
        }

        shuffle.classList.add("btn-primary");
    }
    
});

const showOptions = (dropdown) => {
    const active = document.querySelector(".dropdown.active")
    dropdown.classList.toggle("active")
    if(active == null) {

    } else {
        active.classList.remove("active")
        isClickedtoAddnewPlaylist = false;
    }
}

const dislikeSong = (songId) => {
    console.log(songId);

    const allMusics = JSON.parse(localStorage.getItem("All Musics"));
    let newAllMusics = [];

    var likedSongs = JSON.parse(localStorage.getItem("Liked Songs"));
    let newLikedSongs = [];

    for(let music of allMusics) {
        if(music.id==songId) {
            newAllMusics.push(new Music(music.id, music.title, music.singer, music.img, music.file, "unliked"))
        } else {
            newAllMusics.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition))
        }
    }

    for(let music of likedSongs) {
        if(!(songId==music.id)) {
            newLikedSongs.push(new Music(music.id, music.title, music.singer, music.img, music.file, "liked"))
        }
    }
    localStorage.setItem("All Musics", JSON.stringify(newAllMusics));
    localStorage.setItem("Liked Songs", JSON.stringify(newLikedSongs));
    
    for(let playlistName of playlistNames) {
        const playlist = JSON.parse(localStorage.getItem(playlistName));
        let newPlaylist = [];

        for(let music of playlist) {
            if(songId==music.id) {
                newPlaylist.push(new Music(music.id, music.title, music.singer, music.img, music.file, "unliked"));
            } else {
                newPlaylist.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition));
            }

            localStorage.setItem(playlistName, JSON.stringify(newPlaylist));
        }
    }

    selectList(musicListTitle.innerHTML.slice(0, -39), false)
}

const likeSong = (songId) => {
    console.log(songId)

    const allMusics = JSON.parse(localStorage.getItem("All Musics"));
    let newAllMusics = [];

    if(localStorage.getItem("Liked Songs")) {
        var likedSongs = JSON.parse(localStorage.getItem("Liked Songs"));
    } else {
        var likedSongs = [];
    }
    let newLikedSongs = [];

    for(let music of allMusics) {
        if(music.id==songId) {
            newLikedSongs.push(new Music(music.id, music.title, music.singer, music.img, music.file, "liked"));
            newAllMusics.push(new Music(music.id, music.title, music.singer, music.img, music.file, "liked"));
        } else {
            newAllMusics.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition))
        }
    }
    localStorage.setItem("All Musics", JSON.stringify(newAllMusics));

    for(let music of likedSongs) {
        newLikedSongs.push(new Music(music.id, music.title, music.singer, music.img, music.file, "liked"));
    }
    localStorage.setItem("Liked Songs", JSON.stringify(newLikedSongs));

    for(let playlistName of playlistNames) {
        const playlist = JSON.parse(localStorage.getItem(playlistName));
        let newPlaylist = [];

        for(let music of playlist) {
            if(songId==music.id) {
                newPlaylist.push(new Music(music.id, music.title, music.singer, music.img, music.file, "liked"));
            } else {
                newPlaylist.push(new Music(music.id, music.title, music.singer, music.img, music.file, music.condition));
            }

            localStorage.setItem(playlistName, JSON.stringify(newPlaylist));
        }
    }

    selectList(musicListTitle.innerHTML.slice(0, -39), false)
}

const volumeIcon = (volume) =>{
    if(volume == 0) {
        return 'fa-solid fa-volume-xmark';
    } else if (volume <= 0.5) {
        return 'fa-solid fa-volume-low';
    } else {
        return 'fa-solid fa-volume-high';
    }
}

// remember if the list is shuffled when last played
// delete playlist (after new design)
// remove from this playlist