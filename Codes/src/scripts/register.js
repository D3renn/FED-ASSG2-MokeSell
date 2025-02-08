// API key for accessing the RESTdb.io service.
const APIKEY = "678a13b229bb6d4dd6c56bd2";

// Base URL of the RESTdb.io API endpoint where account data will be stored.
const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts";

// Wait for the DOM to fully load before executing the script.
document.addEventListener("DOMContentLoaded", () => {
    // Select the registration form by its ID.
    const form = document.getElementById("registerForm");
    
    // Add a submit event listener to the form to handle user registration.
    form.addEventListener("submit", (event) => {
        // Prevent the default form submission behavior (which would reload the page).
        event.preventDefault();
        
        // Get the values entered by the user in the username and password fields using jQuery.
        const username = $('#username').val();  // Retrieve the username from the input field.
        const password = $('#password').val();  // Retrieve the password from the input field.
        
        // Create an object containing the user's account data (username and password).
        const accountData = {
            username: username,  // Store the username.
            password: password,  // Store the password.
        };
        
        // Send a POST request to the RESTdb.io API to create a new account.
        fetch(BASE_URL, {
            method: "POST",  // Use the POST method to send data to the server.
            headers: {
                "Content-Type": "application/json",  // Specify that the data being sent is in JSON format.
                "x-apikey": APIKEY,  // Include the API key for authentication with the RESTdb.io service.
            },
            body: JSON.stringify(accountData),  // Convert the account data object to a JSON string and send it in the request body.
        })
        .then((response) => response.json())  // Parse the response from the server as JSON.
        .then((data) => {
            // Log a success message to the console if the account is created successfully.
            console.log("Account created successfully:", data);
            
            // Redirect the user to the home page after successful account creation.
            window.location.href = "/";
        })
        .catch((error) => {
            // Log any errors that occur during the account creation process.
            console.error("Error creating account:", error);
        });
    });
});