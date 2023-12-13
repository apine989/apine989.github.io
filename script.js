const key = "songdata";
let songData = {};
let content = document.getElementById("content");
initialize();

function initialize() {
    const storedData = localStorage.getItem(key);
    // console.log("Stored data: " + storedData);

    if (localStorage.length != 0) {
        console.log("Is using local storage")
        songData = JSON.parse(storedData);
        renderHomeView();
    } else {
        console.log("Is fetching data");
        fetchApi();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("homeview").addEventListener("click", renderHomeView);
    document.getElementById("searchview").addEventListener("click", renderSearchView);
    // document.getElementById("playlistview").addEventListener("click", renderPlaylistView);
});

const creditctr = document.getElementById("creditsbtn");
const popover = document.getElementById("popover");
let t;
creditctr.addEventListener("mouseover", () => {
    popover.style.display = "block";
    clearTimeout(t);
});
creditctr.addEventListener("mouseout", () => {
    timer = setTimeout(() => {
        popover.style.display = "none";
    }, 5000);
});

function fetchApi() {
    const genres = "https://www.randyconnolly.com/funwebdev/3rd/api/music/genres.php";
    const artists = "https://www.randyconnolly.com/funwebdev/3rd/api/music/artists.php";
    const songs = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";

    axios.all([
        axios.get(genres),
        axios.get(artists),
        axios.get(songs),
    ])
        .then(axios.spread(function (genresFetch, artistsFetch, songsFetch) {
            const g = JSON.stringify(genresFetch.data);
            const a = JSON.stringify(artistsFetch.data);
            const s = JSON.stringify(songsFetch.data);

            // console.log("Genres: " + g);
            // console.log("Artists: " + a);
            // console.log("Songs: " + s);
            songData = { genres: JSON.parse(g), artists: JSON.parse(a), songs: JSON.parse(s) };
            // console.log(fetched);
            localStorage.setItem(key, JSON.stringify(songData));
            // console.log("Local storage: " + localStorage.getItem(key));
            renderHomeView();
        }));
}

function clearContent() {
    const content = document.getElementById("content");
    content.innerHTML = "";
}

function renderHomeView() {
        showTopGenres(songData.genres);
        showTopArtists(songData.artists);
        showPopSongs(songData.songs);
}

function showTopGenres(data) {
    const genreSection = document.getElementById("topgenres");
    genreSection.innerHTML = "";

    if (data) {
        data.forEach(genre => {
            const e = document.createElement("li");
            e.textContent = genre.name;
            genreSection.appendChild(e);
        });
    } else {
        alert("No top genre list available");
        // console.log("Error loading top genres");
    }
}

function showTopArtists(data) {
    const artistSection = document.getElementById("topartists");
    artistSection.innerHTML = "";

    if (data) {
        data.forEach(artist => {
            const e = document.createElement("li");
            e.textContent = artist.name;
            artistSection.appendChild(e);
        });
    } else {
        alert("No top artists list available");
        // console.log("Error loading top artists");
    }
}

function showPopSongs(songs) {
    const popSongsSection = document.getElementById("popsongs");
    popSongsSection.innerHTML = "";

    const mostPopularSongs = songs.sort((a, b) => b.popularity - a.popularity).slice(0, 15);

    mostPopularSongs.forEach(song => {
        const e = document.createElement("li");
        e.innerHTML = `<a href="#" onclick="showSongDetails("${song.title}")">${song.title}</a>`;
        popSongsSection.appendChild(e);
    });
}

/* Incomplete */

function renderSearchView() {
    clearContent();

    const h = document.createElement("h2");
    h.textContent = "Search/Browse Songs";
    content.appendChild(h);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search songs...";
    content.appendChild(searchInput);

    const list = document.createElement("div");
    list.id = "list";
    content.appendChild(list);

    const all = songData.songs;

    const updateList = () => {
        const query = searchInput.value.toLowerCase();
        const filtered = filterSongs(all, query);
        // Redo
    };

    searchInput.addEventListener("input", updateList);

    const sortField = getSortField();
    const filtered = filterSongs(all);

    const tableHeaders = document.querySelectorAll("#list th");

    tableHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const sortField = header.dataset.field;
            // Redo
        });
    });
    setFilterOpt();
}

function createFilterOpt(value, label) {
    const opt = document.createElement("input");
    opt.type = "radio";
    opt.name = "filter-type";
    opt.value = value;
    opt.id = `filter-${value}`;

    const optlabel = document.createElement("label");
    optlabel.textContent = label;
    optlabel.htmlFor = `filter-${value}`;

    const filteropt = document.createElement("div");
    filteropt.appendChild(opt);
    filteropt.appendChild(optlabel);

    return filteropt;
}

function setFilterOpt() {
    const filter = document.createElement("div");
    filter.id = "filter-opt";

    const label = document.createElement("label");
    label.textContent = "Filter by: ";

    const title = createFilterOpt("title", "Title");
    const artist = createFilterOpt("artist", "Artist");
    const genre = createFilterOpt("genre", "Genre");

    filter.appendChild(label);
    filter.appendChild(title);
    filter.appendChild(artist);
    filter.appendChild(genre);
    content.appendChild(filter);
    titleFilter.addEventListener("change", () => updateFilterType("title"));
    artistFilter.addEventListener("change", () => updateFilterType("artist"));
    genreFilter.addEventListener("change", () => updateFilterType("genre"));
}

function filterSongs() {
    // Redo
}

function updateFilterType(type) {
    // Set filter type function
    renderSearchView();
}

function clearFilters() {
    document.querySelector("").checked = false;

    renderSearchView(songData.songs);
}

function sortSongs(value) {
    const isAscending = document.querySelector("#list th.sorted").list.includes("asc");

    songData.songs.sort((a, b) => {
        const x = a[value];
        const y = b[value];

        if (typeof x === "string" && typeof y === "string") {
            return isAscending ? x.localeCompare(y) : y.localeCompare(x);
        } else {
            return isAscending ? x - y : y - x;
        }
    });
    renderSearchView();
}

function renderSongDetails(song) {
    clearContent();

    const h = document.createElement("h2");
    h.textContent = "Single Song View";
    content.appendChild(h);

    const songDetails = document.createElement("div");
    songDetails.list.add("songview");

    const title = document.createElement("p");
    title.textContent = `Title: ${song.title}`;
    songDetails.appendChild(title);

    const artist = document.createElement("p");
    artist.textContent = `Artist: ${song.artist}`;
    songDetails.appendChild(artist);

    const year = document.createElement("p");
    year.textContent = `Year: ${song.year}`;
    songDetails.appendChild(year);

    content.appendChild(songDetails);
}

// Add to list
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength - 1) + "..." : text;
}

function getSortField() {
    const sortedTh = document.querySelector("#list th.sorted");
    return sortedTh ? sortedTh.dataset.field : null;
}