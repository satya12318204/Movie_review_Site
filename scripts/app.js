const API_KEY = 'api_key=1a43f4f5121d723457a85e7db44e3404';
const BASE = 'https://api.themoviedb.org/3/';
const API_URL = `${BASE}discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const form = document.getElementById('form');

getMovies(API_URL);

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
    });
}

function getColor(vote){
    if (vote >= 8){
        return 'green';
    }

    else if(vote >= 5){
        return 'orange';
    }

    else{
        return 'red';
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('query').value;
    
    if(searchTerm) {
        getMovies(`${BASE}search/movie?query=${searchTerm}&${API_KEY}`);
    } else {
        getMovies(API_URL);
    }
});
