const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // prevent the page from reloading
        
        const username = $("#username").val(); // comes from html username input
        const password = $("#password").val(); // comes from html password input
        
        // API call GET to the mokesell restdb
        // retrieve information of the username given.
        fetch(BASE_URL + '?q={"username":"' + username + '"}', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            // checking if password matches the password retrieved from database.
            const user = data.find(
                (account) => account.password === password
            );
            if (user) {
                console.log("Login successful:", user);
                document.getElementById("feedback").textContent =
                "Login successful!";
                // Store the user ID in localStorage
                localStorage.setItem("loginId", user._id); 
                localStorage.setItem("userId", user.userID); 
                localStorage.setItem("username", user.username); 
                localStorage.setItem("gamepoints", (user.gamepoints)?user.gamepoints:0); 
                // let loggedInUSerId = localStorage.getItem("userId"); - to check if user is logged in or not.
                // if loggedInUSerId is empty or undefined, means user not logged in.
                // logout
                // localStorage.removeItem("userId")
                
                window.location.href = "/"; // This redirects to index.html
            } else {
                console.error("Invalid username or password.");
                document.getElementById("feedback").textContent =
                "Invalid username or password.";
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
            document.getElementById("feedback").textContent =
            "Error during login.";
        });
    });
});
