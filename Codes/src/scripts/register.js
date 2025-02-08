const APIKEY = "67a717854d8744093c827ff3";
const BASE_URL = "https://mokesell-209e.restdb.io/rest/accounts";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        const accountData = {
            username: username,
            password: password,
        };
        
        fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify(accountData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Account created successfully:", data);
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Error creating account:", error);
        });
    });
});