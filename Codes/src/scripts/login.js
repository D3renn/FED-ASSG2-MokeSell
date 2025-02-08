// API key for accessing the RESTdb.io service.
const APIKEY = "678a13b229bb6d4dd6c56bd2";

// Base URL of the RESTdb.io API endpoint where account data is stored.
const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts";

// Wait for the DOM to fully load before executing the script.
document.addEventListener("DOMContentLoaded", () => {
    // Select the login form by its ID.
    const form = document.getElementById("loginForm");
    
    // Add a submit event listener to the form to handle user login.
    form.addEventListener("submit", (event) => {
        // Prevent the default form submission behavior (which would reload the page).
        event.preventDefault();
        
        // Retrieve the username and password entered by the user from the input fields using jQuery.
        const username = $("#username").val();  // Get the value from the username input field.
        const password = $("#password").val();  // Get the value from the password input field.
        
        // Make a GET request to the RESTdb.io API to retrieve account information based on the provided username.
        fetch(BASE_URL + '?q={"username":"' + username + '"}', {
            method: "GET",  // Use the GET method to retrieve data from the server.
            headers: {
                "Content-Type": "application/json",  // Specify that we expect JSON data in response.
                "x-apikey": APIKEY,  // Include the API key for authentication with the RESTdb.io service.
            },
        })
        .then((response) => response.json())  // Parse the server's response as JSON.
        .then((data) => {
            // Check if any account matches the provided username and password.
            const user = data.find(
                (account) => account.password === password  // Find the account where the password matches.
            );
            
            if (user) {
                // If a matching account is found, log a success message and provide feedback to the user.
                console.log("Login successful:", user);
                document.getElementById("feedback").textContent = "Login successful!";
                
                // Store relevant user information in localStorage for future use.
                localStorage.setItem("loginId", user._id);  // Store the unique ID of the user.
                localStorage.setItem("userId", user.userID);  // Store the user's ID (if applicable).
                localStorage.setItem("username", user.username);  // Store the username.
                localStorage.setItem("gamepoints", (user.gamepoints) ? user.gamepoints : 0);  // Store game points (default to 0 if not set).
                
                // Example of how to check if a user is logged in:
                // let loggedInUserId = localStorage.getItem("userId");
                // If `loggedInUserId` is empty or undefined, it means the user is not logged in.
                
                // To log out, you can remove the user's ID from localStorage:
                // localStorage.removeItem("userId");
                
                // Redirect the user to the home page after successful login.
                window.location.href = "/";  // Redirect to the root URL.
            } else {
                // If no matching account is found, log an error and provide feedback to the user.
                console.error("Invalid username or password.");
                document.getElementById("feedback").textContent = "Invalid username or password.";
            }
        })
        .catch((error) => {
            // Log any errors that occur during the login process and provide feedback to the user.
            console.error("Error during login:", error);
            document.getElementById("feedback").textContent = "Error during login.";
        });
    });
});

