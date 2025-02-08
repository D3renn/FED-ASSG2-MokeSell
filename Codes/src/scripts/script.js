
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