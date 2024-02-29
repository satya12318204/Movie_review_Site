function handleLogin() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email.trim() === "" || password.trim() === "") {
        alert("Please enter both email and password.");
        return false;
    }

    // Perform additional validation or submit the form to the server

    // For demonstration purposes, just navigate to home1.html
    window.location.href = "../html/home1.html";

    return false;
}

