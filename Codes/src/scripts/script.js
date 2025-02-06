
function setupSearch() {
    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-icon");

    searchButton.addEventListener("click", () => {
        const query = searchBar.value.trim();
        if (query) {
            localStorage.setItem("searchQuery", query);
            window.location.href = "/search";
        }
    });

    searchBar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchBar.value.trim();
            if (query) {
                localStorage.setItem("searchQuery", query);
                window.location.href = "/search";
            }
        }
    });
}

let currentPage = 1;
const slider = document.querySelector('.advertisement-slider');
const dots = document.querySelectorAll('.dot');

function slideAdvertisements() {
    if (currentPage === 1) {
        slider.style.transform = 'translateX(-50%)';
        currentPage = 2;
    } else {
        slider.style.transform = 'translateX(0%)';
        currentPage = 1;
    }
    updateDots();
}

function updateDots() {
    dots.forEach((dot, index) => {
        if (index + 1 === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const page = parseInt(dot.getAttribute('data-page'));
        if (page !== currentPage) {
            currentPage = page;
            slider.style.transform = `translateX(${-(page - 1) * 50}%)`;
            updateDots();
        }
    });
});

setInterval(slideAdvertisements, 5000); // Change page every 5 seconds

    // Initialize Lottie for the Game Advertisement
    var gameAnimation = lottie.loadAnimation({
        container: document.getElementById('game-lottie'), // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets3.lottiefiles.com/packages/lf20_4bqydb9x.json' // Gaming Lottie animation
    });

    // Initialize Lottie for the Add Listing Advertisement
    var listingAnimation = lottie.loadAnimation({
        container: document.getElementById('listing-lottie'), // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets3.lottiefiles.com/packages/lf20_qw6cnyjy.json' // Property Listing Lottie animation
    });

function routeGame() {
    window.location.href = "/game";
}

function routeHome() {
    window.location.href = "/";
}

function routeProfile() {
    window.location.href = "/profile";
}

function routeListing() {
    window.location.href = "/listing";
}

function routeChat() {
    window.location.href = "/chat";
}