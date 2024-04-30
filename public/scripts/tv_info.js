async function getTVShowDetails(tvId) {
    const API_KEY = "api_key=1a43f4f5121d723457a85e7db44e3404";
    const BASE = "https://api.themoviedb.org/3/";
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
  
    try {
      const response = await fetch(`${BASE}tv/${tvId}?${API_KEY}`);
      const tvData = await response.json();
  
      if (tvData && tvData.poster_path) {
        const tvPosterPath = tvData.poster_path
          ? IMG_PATH + tvData.poster_path
          : "placeholder_poster.jpg";
        const tvOverview = tvData.overview
          ? tvData.overview
          : "No overview available";
        document.getElementById("tvshow-poster").src = tvPosterPath;
        document.getElementById("tvshow-overview-text").textContent = tvOverview;
      } else {
        console.error("TV show details not found.");
      }
    } catch (error) {
      console.error("Error fetching TV show details:", error);
    }
  }
  
  async function getYouTubeTrailer(tvTitle) {
    const YOUTUBE_API_KEY = "AIzaSyDj1WRkLEAgAob-kIW6whCeY3-BVFpRW3I";
    const searchQuery = encodeURIComponent(tvTitle + " trailer");
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
  
  window.onload = async function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tvId = urlParams.get("id");
    const tvTitle = urlParams.get("title");
  
    if (tvId && tvTitle) {
      await getTVShowDetails(tvId);
      await getYouTubeTrailer(tvTitle);
  
      fetch(`/tvshow-reviews?tvTitle=${encodeURIComponent(tvId)}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(async (reviews) => {
          const reviewsContainer = document.querySelector(".given_reviews");
          reviewsContainer.innerHTML = "";
          for (const review of reviews) {
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-box");
  
            const reviewContent = document.createElement("div");
            reviewContent.classList.add("review-content");
  
            const userData = await getUserDetails(review.userId._id);
            const userName = userData.name;
  
            reviewContent.textContent = `${userName}: ${review.reviewText}`;
            reviewBox.appendChild(reviewContent);
            reviewsContainer.appendChild(reviewBox);
          }
        })
        .catch((error) => {
          console.error("There was a problem fetching reviews:", error);
        });
    }
  
    document
      .getElementById("submitReviewButton")
      .addEventListener("click", function () {
        const reviewText = document.getElementById("reviewTextArea").value;
  
        fetch("/storeReview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tvTitle, reviewText }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            console.log(data.message);
            alert("Review submitted successfully!");
            window.location.reload();
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            alert("There was a problem submitting your review. Please try again later.");
          });
  
        document.getElementById("reviewTextArea").value = "";
      });
  };