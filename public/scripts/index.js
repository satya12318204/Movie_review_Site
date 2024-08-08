const API_KEY = 'api_key=1a43f4f5121d723457a85e7db44e3404';
const BASE = 'https://api.themoviedb.org/3/';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const form = document.getElementById('form');

getMovies(`${BASE}discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&${API_KEY}`);

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);
            showMovies(data.results);
        });
}

function showMovies(data) {
    const mainElement = document.getElementById('main');

    mainElement.innerHTML = '';

    data.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${IMG_PATH}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="${getColor(movie.vote_average)}">${movie.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${movie.overview}
            </div>
        `;
        mainElement.appendChild(movieEl);
        // Add event listener to each movie element
        // Inside the event listener for movie click
        movieEl.addEventListener('click', () => {
            // Extract movie details
            const movieId = movie.id;
            const movieTitle = movie.title;
            // Redirect to movie-info page with movie details as query parameters
            window.location.href = `/movie-info?id=${movieId}&title=${encodeURIComponent(movieTitle)}`;
        });

    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('query').value;

    if (searchTerm) {
        try {
            const movieResponse = await fetch(`${BASE}search/movie?query=${searchTerm}&${API_KEY}`);
            const movieData = await movieResponse.json();
            if (movieData.results && movieData.results.length > 0) {
                // Display movie results if found
                showMovies(movieData.results);
            } else {
                // If no movie results found, search for TV shows
                const tvResponse = await fetch(`${BASE}search/tv?query=${searchTerm}&${API_KEY}`);
                const tvData = await tvResponse.json();
                if (tvData.results && tvData.results.length > 0) {
                    // Display TV show results if found
                    showTvShows(tvData.results);
                } else {
                    // If no movie or TV show results found, display a message
                    console.log("No results found for movies or TV shows");
                }
            }
        } catch (error) {
            console.error("Error searching for movies or TV shows:", error);
        }
    } else {
        // If search term is empty, display popular movies
        getMovies(`${BASE}discover/movie?sort_by=popularity.desc&${API_KEY}`);
    }
});

// Add event listeners to the navigation links
document.getElementById('popular').addEventListener('click', () => {
    getMovies(`${BASE}discover/movie?sort_by=popularity.desc&${API_KEY}`);
});

document.getElementById('movies').addEventListener('click', () => {
    getMovies(`${BASE}discover/movie?sort_by=release_date.desc&${API_KEY}`);
});

document.getElementById('tvshows').addEventListener('click', () => {
    getTvShows(`${BASE}discover/tv?sort_by=popularity.desc&${API_KEY}`);
});

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getTvShows(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);
            showTvShows(data.results);
        });
}

function showTvShows(data) {
    const mainElement = document.getElementById('main');

    mainElement.innerHTML = '';

    data.forEach(tvShow => {
        const tvShowEl = document.createElement("div");
        tvShowEl.classList.add('tv-show');
        tvShowEl.innerHTML = `
            <img src="${IMG_PATH}${tvShow.poster_path}" alt="${tvShow.name}">
            <div class="tv-show-info">
                <h3>${tvShow.name}</h3>
                <span class="${getColor(tvShow.vote_average)}">${tvShow.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${tvShow.overview}
            </div>
        `;
        mainElement.appendChild(tvShowEl);
        // Add event listener to each TV show element
        // Inside the event listener for TV show click
        tvShowEl.addEventListener('click', () => {
            // Extract TV show details
            const tvShowId = tvShow.id;
            const tvShowTitle = tvShow.name;
            // Redirect to TV show info page with TV show details as query parameters
            window.location.href = `/tv-show-info?id=${tvShowId}&title=${encodeURIComponent(tvShowTitle)}`;
        });

    });
}
