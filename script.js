const body = document.body;
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist");
const albumArt = document.getElementById("album-art");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress");
const volumeSlider = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
const volumeContainer = document.querySelector(".volume-container");
const trackList = document.querySelectorAll(".track-item");
const sidebarItems = document.querySelectorAll(".sidebar-item");


// Function to remove active class from all and set it to the selected one
function setActiveTab(selectedTab) {
    sidebarItems.forEach(item => item.classList.remove("active"));
    selectedTab.classList.add("active");
}

// Default to highlighting "For You"
document.getElementById("for-you").classList.add("active");

// Attach event listeners to sidebar items
sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
        setActiveTab(item);
    });
});
let audio = new Audio();

let songs = [
    { title: "Starboy", artist: "The Weeknd", cover: "assets/starboyalbumart.webp", url: "assets/song1.mp3" },
    { title: "Demons", artist: "Imagine Dragons", cover: "assets/demonsalbumart.jpg", url: "assets/song2.mp3" },
    { title: "Mouth Of The River", artist: "Imagine Dragons", cover: "assets/mouthoftheriveralbumart.jpeg", url: "assets/song3.mp3" },
    { title: "Ghost Stories", artist: "Coldplay", cover: "assets/ghoststoriesalbumart.webp", url: "assets/song4.mp3" },
    { title: "Sparks", artist: "Coldplay", cover: "assets/sparksalbumart.jpeg", url: "assets/song5.mp3" },
    { title: "Viva La Vida", artist: "Coldplay", cover: "assets/viva.jpg", url: "assets/song6.mp3" },
    { title: "Hymn For The Weekend", artist: "Coldplay", cover: "assets/hymnfortheweekendcover.jpg", url: "assets/song7.mp3" },
    { title: "Pain", artist: "Ryan Jones", cover: "assets/paincover.jpg", url: "assets/song8.mp3" },
];

let currentSongIndex = 0;

// Load and play song when a track is clicked
trackList.forEach((track, index) => {
    track.addEventListener("click", () => {
        trackList.forEach(t => t.classList.remove("active-track")); // Remove highlight from all
        track.classList.add("active-track"); // Highlight selected track
        
        loadSong(index);
        audio.play();
        playButton.innerHTML = `<i class="fas fa-pause"></i>`;
    });
});

let defaultSongListHTML = ""; // Store original song list

document.addEventListener("DOMContentLoaded", () => {
    let trackList = document.getElementById("tracks");
    defaultSongListHTML = trackList.innerHTML; // Save the original list
});
document.getElementById("for-you").addEventListener("click", () => {
    let trackList = document.getElementById("tracks");

    // Restore original song list
    trackList.innerHTML = defaultSongListHTML;
    attachTrackEventListeners();

});
function attachTrackEventListeners() {
    let trackItems = document.querySelectorAll(".track-item");

    trackItems.forEach((track, index) => {
        track.addEventListener("click", () => {
            trackItems.forEach(t => t.classList.remove("active-track")); // Remove previous highlight
            track.classList.add("active-track"); // Highlight selected track
            
            loadSong(index);
            audio.play();
            playButton.innerHTML = `<i class="fas fa-pause"></i>`;
        });
    });
}

// For background effect
function applyBackgroundEffect(imageSrc) {
    const bgImage = document.getElementById("bg-image");
    bgImage.src = imageSrc;
}


function addToRecentlyPlayed(song) {
    let recentlyPlayed = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];

    // To avoid duplicate entries
    recentlyPlayed = recentlyPlayed.filter(s => s.title !== song.title);

    // Create a temporary audio element to get duration
    let tempAudio = new Audio(song.url);
    tempAudio.addEventListener("loadedmetadata", function () {
        let duration = formatTime(tempAudio.duration);

        // Add song with duration
        recentlyPlayed.unshift({
            title: song.title,
            artist: song.artist,
            cover: song.cover,
            url: song.url,
            duration: duration
        });

        // Limit to last 10 songs
        if (recentlyPlayed.length > 10) {
            recentlyPlayed.pop();
        }

        sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
    });
}



// Function to load the song
function loadSong(index) {
    currentSongIndex = index;
    let song = songs[index];

    songTitle.innerText = song.title;
    artistName.innerText = song.artist;
    albumArt.src = song.cover;
    audio.src = song.url;
    audio.currentTime = 0;

    applyBackgroundEffect(song.cover);

    /* For Top Tracks Play count */
    trackPlayCount(song);

    // Remove highlight from all tracks and highlight the current one
    let trackItems = document.querySelectorAll(".track-item");
    trackItems.forEach(t => t.classList.remove("active-track"));

    if (trackItems[index]) {
        trackItems[index].classList.add("active-track");
    }
    addToRecentlyPlayed(song);
}

// To display soung durations in menu and middle pane
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "--:--";
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}


document.getElementById("recently-played").addEventListener("click", () => {
    let recentlyPlayed = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];
    let trackList = document.getElementById("tracks");

    // Clear existing list
    trackList.innerHTML = "";

    // Populate with recently played songs
    recentlyPlayed.forEach(song => {
        let li = document.createElement("li");
        li.classList.add("track-item");

        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="track-info">
                <span class="title">${song.title}</span>
                <span class="artist">${song.artist}</span>
            </div>
            <span class="track-duration">${song.duration || "--:--"}</span>
        `;

        // Click event to play the song
        li.addEventListener("click", () => {
            let songIndex = songs.findIndex(s => s.title === song.title);
            if (songIndex !== -1) {
                loadSong(songIndex);
                audio.play();
                playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            }
        });

        trackList.appendChild(li);
    });
});

audio.addEventListener("loadedmetadata", () => {
    progressBar.max = 100; // Ensure progress bar fills fully
});


audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        let progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        progressBar.style.background = `linear-gradient(to right,rgb(255, 255, 255) ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%)`;
    }
});



progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function playPause() {
    if (audio.paused) {
        audio.play();
        playButton.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
        audio.pause();
        playButton.innerHTML = `<i class="fas fa-play"></i>`;
    }
}

playButton.addEventListener("click", playPause);
prevButton.addEventListener("click", () => {
    loadSong((currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length));
    audio.play(); // Ensure the new song starts playing
    playButton.innerHTML = `<i class="fas fa-pause"></i>`; // Update play button icon
});

nextButton.addEventListener("click", () => {
    loadSong((currentSongIndex = (currentSongIndex + 1) % songs.length));
    audio.play(); // Ensure the new song starts playing
    playButton.innerHTML = `<i class="fas fa-pause"></i>`; // Update play button icon
});

// Volume slider beside speaker icon
volumeContainer.style.display = "flex";
volumeContainer.style.alignItems = "center";
volumeSlider.style.opacity = "0";
volumeSlider.style.transition = "opacity 0.3s ease-in-out";
volumeSlider.style.marginLeft = "10px"; // Position beside speaker

volumeContainer.addEventListener("mouseover", () => {
    volumeSlider.style.opacity = "1";
});

volumeContainer.addEventListener("mouseleave", () => {
    volumeSlider.style.opacity = "0";
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});
// Update volume control
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Add this to ensure audio continues when switching tabs
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !audio.paused) {
        audio.play();
    }
});
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.track-item').forEach(item => {
        const title = item.querySelector('.title').textContent.toLowerCase();
        item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
    });
});

loadSong(currentSongIndex);

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "--:--";
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

// For Favourites
document.getElementById("addToFavourites").addEventListener("click", () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    let song = songs[currentSongIndex];

    // Create a temporary audio element to get duration
    let tempAudio = new Audio(song.url);
    tempAudio.addEventListener("loadedmetadata", function () {
        let duration = formatTime(tempAudio.duration);

        // Check if song is already in favourites
        let exists = favourites.some(s => s.title === song.title);

        if (!exists) {
            favourites.push({
                title: song.title,
                artist: song.artist,
                cover: song.cover,
                url: song.url,
                duration: duration // Store duration here
            });

            localStorage.setItem("favourites", JSON.stringify(favourites));
            alert(`${song.title} added to Favourites!`);
        } else {
            // Remove from favourites if already present
            favourites = favourites.filter(s => s.title !== song.title);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            alert(`${song.title} removed from Favourites!`);
        }
    });
});
document.getElementById("favourites").addEventListener("click", () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    let trackList = document.getElementById("tracks");

    // Clear existing list
    trackList.innerHTML = "";

    // Populate with favourite songs
    favourites.forEach(song => {
        let li = document.createElement("li");
        li.classList.add("track-item");

        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="track-info">
                <span class="title">${song.title}</span>
                <span class="artist">${song.artist}</span>
            </div>
            <span class="track-duration">${song.duration || "--:--"}</span>
        `;

        // Click event to play the song
        li.addEventListener("click", () => {
            let songIndex = songs.findIndex(s => s.title === song.title);
            if (songIndex !== -1) {
                loadSong(songIndex);
                audio.play();
                playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            }
        });

        trackList.appendChild(li);
    });
});

// For Top Tracks
function trackPlayCount(song) {
    let topTracks = JSON.parse(localStorage.getItem("topTracks")) || {};

    let tempAudio = new Audio(song.url);
    tempAudio.addEventListener("loadedmetadata", function () {
        let duration = formatTime(tempAudio.duration);

        if (!topTracks[song.title]) {
            topTracks[song.title] = {
                title: song.title,
                artist: song.artist,
                cover: song.cover,  // Ensure album art is stored
                url: song.url,
                duration: duration,
                count: 0
            };
        }

        // Update count and ensure cover is always set
        topTracks[song.title].count += 1;
        topTracks[song.title].cover = song.cover; // Ensures album art is stored

        // Save back to Local Storage
        localStorage.setItem("topTracks", JSON.stringify(topTracks));
    });
}


document.getElementById("top-tracks").addEventListener("click", () => {
    let topTracks = JSON.parse(localStorage.getItem("topTracks")) || {};
    let trackList = document.getElementById("tracks");

    // Convert object to array and sort by play count
    let sortedTracks = Object.values(topTracks).sort((a, b) => b.count - a.count);

    // Clear existing list
    trackList.innerHTML = "";

    // Populate with top played songs
    sortedTracks.forEach(song => {
        let li = document.createElement("li");
        li.classList.add("track-item");

        li.innerHTML = `
            <img src="${song.cover || 'assets/default-cover.jpg'}" alt="${song.title}" onerror="this.src='assets/default-cover.jpg'">
            <div class="track-info">
                <span class="title">${song.title}</span>
                <span class="artist">${song.artist}</span>
            </div>
            <span class="track-duration">${song.duration || "--:--"} (${song.count} plays)</span>
        `;

        // Click event to play the song
        li.addEventListener("click", () => {
            let songIndex = songs.findIndex(s => s.title === song.title);
            if (songIndex !== -1) {
                loadSong(songIndex);
                audio.play();
                playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            }
        });

        trackList.appendChild(li);
    });
});

