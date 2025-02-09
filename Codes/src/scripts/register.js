const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts";

function showAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'animation-overlay';
    overlay.innerHTML = `
        <dotlottie-player src="https://lottie.host/ad3b2cf2-5349-4f6e-83cc-99b882fab7de/MVP830YOHZ.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 3000); // Remove after 3 seconds
}

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
            showAnimation();
            setTimeout(() => {
                window.location. href = "/";
            }, 3000); // Redirect after animation
        })
        .catch((error) => {
            console.error("Error creating account:", error);
        });
    });
});
