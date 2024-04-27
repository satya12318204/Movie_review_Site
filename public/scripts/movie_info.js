// On page load, extract movie details from URL parameters and populate the movie details
      // Function to fetch and display movie details by ID
      async function getMovieDetails(movieId) {
        const API_KEY = "api_key=1a43f4f5121d723457a85e7db44e3404";
        const BASE = "https://api.themoviedb.org/3/";
        const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

        try {
          const response = await fetch(`${BASE}movie/${movieId}?${API_KEY}`);
          const data = await response.json();

          const posterPath = data.poster_path
            ? IMG_PATH + data.poster_path
            : "placeholder_poster.jpg"; // Use a placeholder if no poster available
          const movieOverview = data.overview
            ? data.overview
            : "No overview available";
          document.getElementById("movie-poster").src = posterPath;
          document
            .getElementById("movie-overview")
            .getElementsByTagName("p")[0].textContent = movieOverview;
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }

      // Function to fetch and display YouTube trailer based on movie title
      async function getYouTubeTrailer(movieTitle) {
        const YOUTUBE_API_KEY = "AIzaSyDj1WRkLEAgAob-kIW6whCeY3-BVFpRW3I";
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

      // On page load, extract movie details from URL parameters and populate the movie details
      window.onload = async function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const movieId = urlParams.get("id");
        const movieTitle = urlParams.get("title");

        if (movieId && movieTitle) {
          // Call functions to fetch and display movie details
          await getMovieDetails(movieId);
          await getYouTubeTrailer(movieTitle);

          // Fetch reviews for the movie from the server
          fetch(`/movie-reviews?movieName=${encodeURIComponent(movieTitle)}`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Network response was not ok.");
            })
            .then(async (reviews) => {
              // Display reviews in the HTML
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
                  reviewsContainer.appendChild(reviewBox);
              }
          })
          
            .catch((error) => {
              console.error("There was a problem fetching reviews:", error);
            });
        }

        // Add an event listener to the submit button
        document
          .getElementById("submitReviewButton")
          .addEventListener("click", function () {
            // Get the review text and movie title
            const reviewText = document.getElementById("reviewTextArea").value;
            const movieTitle = urlParams.get("title");

            // Send an HTTP POST request to your server to store the review
            fetch("/storeReview", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ movieTitle, reviewText }),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Network response was not ok.");
              })
              .then((data) => {
                console.log(data.message); // Log the response from the server
                // Optionally, you can display a success message to the user
                alert("Review submitted successfully!");
                window.location.reload();
              })
              .catch((error) => {
                console.error(
                  "There was a problem with the fetch operation:",
                  error
                );
                // Optionally, you can display an error message to the user
                alert(
                  "There was a problem submitting your review. Please try again later."
                );
              });

            // Clear the review text box
            document.getElementById("reviewTextArea").value = "";
          });
      };