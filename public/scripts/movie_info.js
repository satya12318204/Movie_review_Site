async function getMovieDetails(movieId) {
  const API_KEY = "api_key=1a43f4f5121d723457a85e7db44e3404";
  const BASE = "https://api.themoviedb.org/3/";
  const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

  try {
    const movieResponse = await fetch(`${BASE}movie/${movieId}?${API_KEY}`);
    const tvResponse = await fetch(`${BASE}tv/${movieId}?${API_KEY}`);

    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    if (movieData && movieData.poster_path) {
      const moviePosterPath = IMG_PATH + movieData.poster_path;
      const movieOverview = movieData.overview || "No overview available";
      document.getElementById("movie-poster").src = moviePosterPath;
      document.getElementById("movie-overview").textContent = movieOverview;
    } else if (tvData && tvData.poster_path) {
      const tvPosterPath = IMG_PATH + tvData.poster_path;
      const tvOverview = tvData.overview || "No overview available";
      document.getElementById("movie-poster").src = tvPosterPath;
      document.getElementById("movie-overview").textContent = tvOverview;
    } else {
      document.getElementById("movie-poster").src = "placeholder_poster.jpg";
      document.getElementById("movie-overview").textContent = "No details available";
    }
  } catch (error) {
    console.error("Error fetching movie or TV show details:", error);
  }
}

async function getYouTubeTrailer(movieTitle) {
  const YOUTUBE_API_KEY = "AIzaSyDlhoIW7bBLq25IbIfiQiS4F_yflR9iLNU";
  const searchQuery = encodeURIComponent(movieTitle + " trailer");
  const YOUTUBE_SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(YOUTUBE_SEARCH_URL);
    const data = await response.json();

    const videoId = data.items[0].id.videoId;
    const embeddedVideoUrl = `https://www.youtube.com/embed/${videoId}`;

    const trailerIframe = document.createElement("iframe");
    trailerIframe.setAttribute("width", "900");
    trailerIframe.setAttribute("height", "450");
    trailerIframe.setAttribute("src", embeddedVideoUrl);
    trailerIframe.setAttribute("frameborder", "0");
    trailerIframe.setAttribute("allowfullscreen", "");

    const trailerContainer = document.getElementById("trailer-container");
    trailerContainer.innerHTML = ""; // Clear previous trailer (if any)
    trailerContainer.appendChild(trailerIframe);
  } catch (error) {
    console.error("Error fetching YouTube trailer:", error);
  }
}

async function getUserDetails(userId) {
  try {
    const response = await fetch(`/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return "Unknown User";
  }
}

async function getTVShowDetails(tvId) {
  const API_KEY = "api_key=1a43f4f5121d723457a85e7db44e3404";
  const BASE = "https://api.themoviedb.org/3/";
  const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

  try {
    const response = await fetch(`${BASE}tv/${tvId}?${API_KEY}`);
    const tvData = await response.json();

    if (tvData && tvData.poster_path) {
      const tvPosterPath = IMG_PATH + tvData.poster_path;
      const tvOverview = tvData.overview || "No overview available";
      document.getElementById("tv-show-poster").src = tvPosterPath;
      document.getElementById("tv-show-overview").textContent = tvOverview;
    } else {
      document.getElementById("tv-show-poster").src = "placeholder_poster.jpg";
      document.getElementById("tv-show-overview").textContent = "No details available";
    }
  } catch (error) {
    console.error("Error fetching TV show details:", error);
  }
}

async function getReviews(movieTitle) {
  try {
    const response = await fetch(`/movie-reviews?movieName=${encodeURIComponent(movieTitle)}`);
    if (!response.ok) throw new Error("Network response was not ok.");

    const reviews = await response.json();
    const reviewsContainer = document.querySelector(".given_reviews");
    reviewsContainer.innerHTML = ""; // Clear previous reviews

    for (const review of reviews) {
      const reviewBox = document.createElement("div");
      reviewBox.classList.add("review-box");

      const reviewContent = document.createElement("div");
      reviewContent.classList.add("review-content");

      const userData = await getUserDetails(review.userId._id);
      const userName = userData.name; // Access the name property

      reviewContent.textContent = `${userName}: ${review.reviewText}`;
      reviewBox.appendChild(reviewContent);

      // Add delete button for reviews
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-review-btn");
      deleteButton.dataset.reviewId = review._id;
      deleteButton.textContent = "Delete";
      reviewBox.appendChild(deleteButton);

      deleteButton.addEventListener("click", () => {
        deleteReview(review._id);
      });

      reviewsContainer.appendChild(reviewBox);
    }
  } catch (error) {
    console.error("There was a problem fetching reviews:", error);
  }
}

async function deleteReview(reviewId) {
  try {
      const response = await fetch(`/reviews/${reviewId}`, { method: 'DELETE' });

      if (response.ok) {
          // Successfully deleted
          alert("Review deleted successfully!");
          window.location.reload(); // Reload the page to refresh reviews
      } else {
          // Handle unauthorized or other errors
          const data = await response.json();
          alert(data.error || "Failed to delete the review.");
      }
  } catch (error) {
      console.error("There was a problem deleting the review:", error);
      alert("An error occurred while deleting the review.");
  }
}


window.onload = async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieId = urlParams.get("id");
  const movieTitle = urlParams.get("title");

  if (movieId && movieTitle) {
    await getMovieDetails(movieId);
    await getYouTubeTrailer(movieTitle);
    await getReviews(movieTitle);
  }

  document.getElementById("submitReviewButton").addEventListener("click", async function () {
    const reviewText = document.getElementById("reviewTextArea").value;
    const movieTitle = urlParams.get("title");

    try {
      const response = await fetch("/storeReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieTitle, reviewText }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");

      alert("Review submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("There was a problem submitting your review:", error);
      alert("There was a problem submitting your review. Please try again later.");
    }
    document.getElementById("reviewTextArea").value = "";
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-review-btn')) {
      const reviewId = event.target.dataset.reviewId;
      if (confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
      }
    }
  });
};
