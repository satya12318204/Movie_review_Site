// signup.js
function handleSignUp(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Save user information to localStorage
    localStorage.setItem('user', JSON.stringify({ email, password }));

    // Redirect to login.html
    window.location.href = 'login.html';
}
