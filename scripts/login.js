// ./scripts/login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get username and password from the form
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Perform your login logic here
    // For simplicity, let's assume a successful login
    var isLoggedIn = true;

    if (isLoggedIn) {
        // If login is successful, navigate to home.html
        window.location.href = 'home1.html';
    } else {
        // If login fails, display an error message (you can customize this part)
        alert('Login failed. Please check your credentials and try again.');
    }
});

function createAccount() {
    // Implement your logic for creating a new account
    // This can include navigating to a signup page or showing a modal
    alert('Implement your logic for creating a new account.');
}
