// Function to fetch and display movie details by ID
async function getMovieDetails(movieId) {
    const API_KEY = 'api_key=1a43f4f5121d723457a85e7db44e3404';
    const BASE = 'https://api.themoviedb.org/3/';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

    try {
        const response = await fetch(`${BASE}movie/${movieId}?${API_KEY}`);
        const data = await response.json();

        const posterPath = data.poster_path ? IMG_PATH + data.poster_path : 'placeholder_poster.jpg'; // Use a placeholder if no poster available
        const movieOverview = data.overview ? data.overview : 'No overview available';
        document.getElementById('movie-poster').src = posterPath;
        document.getElementById('movie-overview').getElementsByTagName('p')[0].textContent = movieOverview;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to fetch and display YouTube trailer based on movie title
async function getYouTubeTrailer(movieTitle) {
    const YOUTUBE_API_KEY = 'AIzaSyDj1WRkLEAgAob-kIW6whCeY3-BVFpRW3I';
    const searchQuery = encodeURIComponent(movieTitle + ' trailer');
    const YOUTUBE_SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(YOUTUBE_SEARCH_URL);
        const data = await response.json();

        const videoId = data.items[0].id.videoId;
        const embeddedVideoUrl = `https://www.youtube.com/embed/${videoId}`;

        const trailerIframe = document.createElement('iframe');
        trailerIframe.setAttribute('width', '900');
        trailerIframe.setAttribute('height', '450');
        trailerIframe.setAttribute('src', embeddedVideoUrl);
        trailerIframe.setAttribute('frameborder', '0');
        trailerIframe.setAttribute('allowfullscreen', '');

        document.getElementById('trailer-container').appendChild(trailerIframe);
    } catch (error) {
        console.error('Error fetching YouTube trailer:', error);
    }
}

// Function to handle click event on movie elements
function handleMovieClick(movieId, movieTitle) {
    getMovieDetails(movieId);
    getYouTubeTrailer(movieTitle);
}

// On page load, extract movie details from URL parameters and populate the movie details
window.onload = async function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get('id');
    const movieTitle = urlParams.get('title');

    if (movieId && movieTitle) {
        // Call functions to fetch and display movie details
        await getMovieDetails(movieId);
        await getYouTubeTrailer(movieTitle);
    }
}

// Example: Assuming you have a movie element with ID and Title attributes
const movieElement = document.getElementById('your-movie-element-id');
movieElement.addEventListener('click', function() {
    const movieId = this.getAttribute('data-movie-id');
    const movieTitle = this.getAttribute('data-movie-title');
    handleMovieClick(movieId, movieTitle);
});
