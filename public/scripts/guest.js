// Function to generate a random username
function generateUsername() {
    const usernamePrefix = "guestuser";
    const randomSuffix = Math.floor(Math.random() * 10000);
    return usernamePrefix + randomSuffix;
}

// Function to generate a random email
function generateEmail(username) {
    return `${username}@googleguest.com`;
}

// Function to generate a random password
function generatePassword() {
    // Generate a random string of characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 8;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

// Function to send guest credentials to the server
async function sendGuestCredentials() {
    try {
        const username = generateUsername();
        const email = generateEmail(username);
        const password = generatePassword();

        const response = await fetch('/create-guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            const { username, email, password } = await response.json();
            displayCredentials(username, email, password);
        } else {
            throw new Error('Failed to create guest credentials');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display guest credentials on the page
function displayCredentials(username, email, password) {
    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;
    document.getElementById('password').innerText = password;
}

// Function to redirect to the login page
function redirectToLogin() {
    window.location.href = "/login";
}

// Call the function to send guest credentials when the page loads
sendGuestCredentials();
