const reviewsContainer = document.getElementById("reviewsContainer");
      document.addEventListener("DOMContentLoaded", () => {
        const userList = document.getElementById("userList");
        const userDetailsContainer = document.getElementById(
          "userDetailsContainer"
        );

        const showReviewsBtn = document.getElementById("showReviewsBtn");
        const updateUserRoleForm =
          document.getElementById("updateUserRoleForm");

        userList.addEventListener("click", async (event) => {
          if (event.target.classList.contains("user-button")) {
            const userId = event.target.dataset.userId;
            const userDetailsResponse = await fetch(`/users/${userId}`);
            const userDetails = await userDetailsResponse.json();

            const userDetailsHTML = `
            <div class="user-details">
              <h2>User Details:</h2>
              <p><strong>Name:</strong> ${userDetails.name}</p>
              <p><strong>Email:</strong> ${userDetails.email}</p>
              <p><strong>Role:</strong> ${userDetails.role}</p>
            </div>
          `;

            userDetailsContainer.innerHTML = userDetailsHTML;
            updateUserRoleForm.style.display = "block"; // Show the form
          }
        });

        showReviewsBtn.addEventListener("click", () => {
          const isReviewsVisible = reviewsContainer.style.display !== "none";
          reviewsContainer.style.display = isReviewsVisible ? "none" : "block";
          showReviewsBtn.textContent = isReviewsVisible
            ? "Show Reviews"
            : "Hide Reviews";
        });

        // Handle form submission
        updateUserRoleForm.addEventListener("submit", async (event) => {
          event.preventDefault(); // Prevent default form submission

          const userId = document.querySelector(".user-button.active").dataset
            .userId; // Assuming you have a way to track the active user button
          const role = document.getElementById("role").value;

          try {
            // Send a POST request to the server to update the user's role
            const response = await fetch("/change_role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, role }),
            });

            if (response.ok) {
              alert("User role updated successfully!");
            } else {
              alert("Failed to update user role.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating user role.");
          }
        });
      });

      userList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("user-button")) {
          // Remove the 'active' class from all user buttons
          const userButtons = document.querySelectorAll(".user-button");
          userButtons.forEach((button) => button.classList.remove("active"));

          // Add the 'active' class to the clicked user button
          event.target.classList.add("active");

          const userId = event.target.dataset.userId;
          const userDetailsResponse = await fetch(`/users/${userId}`);
          const userDetails = await userDetailsResponse.json();

          const userDetailsHTML = `
            <div class="user-details">
              <h2>User Details:</h2>
              <p><strong>Name:</strong> ${userDetails.name}</p>
              <p><strong>Email:</strong> ${userDetails.email}</p>
              <p><strong>Role:</strong> ${userDetails.role}</p>
            </div>
          `;

          userDetailsContainer.innerHTML = userDetailsHTML;
          updateUserRoleForm.style.display = "block"; // Show the form
        }
      });

      const deleteReview = async (reviewId, reviewsContainer) => {
        try {
          // Send a DELETE request to the server to delete the review
          const response = await fetch(`/reviews/${reviewId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // Remove the deleted review from the DOM
            const reviewItem = document.getElementById(`review_${reviewId}`);
            reviewItem.remove();
            alert("Review deleted successfully!");
          } else {
            alert("Failed to delete the review.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Review deleted Successfully.");
          location.reload();
        }
      };

      // Add event listener to the "Delete" buttons
      reviewsContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-review-btn")) {
          const reviewId = event.target.dataset.reviewId;
          if (confirm("Are you sure you want to delete this review?")) {
            deleteReview(reviewId, reviewsContainer);
          }
        }
      });