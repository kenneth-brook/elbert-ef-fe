document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('.login-button');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    loginButton.addEventListener('click', function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Stage/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Failed to login: ${response.status} - ${text}`);
                });
            }
            return response.text();
        })
        .then(data => {
            window.location.href = './portal/index.html'; // Redirect to the SPA
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Detailed message:', error.message);
            document.querySelector('.error-message').innerHTML = 'Login Failed: ' + error.message;
        });
    });
});
