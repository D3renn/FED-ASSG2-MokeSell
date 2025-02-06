const APIKEY = "678a13b229bb6d4dd6c56bd2";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";
const LISTINGS_URL = "https://mokesell-2304.restdb.io/rest/listings";

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchListings();
});

function fetchCategories() {
    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ''; // Clear the product list only once

        if (data.length === 0) {
            productList.innerHTML = '<p>No categories available.</p>';
        } else {
            data.forEach((category) => {
                const categorySection = `
                    <div class="product-section" data-category="${category.categoryName.toLowerCase()}">
                        <div class="section-header">
                            <h2>${category.categoryName}</h2>
                            <button class="view-all" onclick="redirectToCategory('${category._id}')">View All</button>
                        </div>
                        <div class="product-scroll" id="${category.categoryName.toLowerCase()}-list">
                            <p>Loading ${category.categoryName.toLowerCase()} listings...</p>
                        </div>
                    </div>
                `;
                productList.insertAdjacentHTML('beforeend', categorySection);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}

function fetchListings() {
    fetch(`${LISTINGS_URL}?q={"quantity":{"$gt":0}}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.length === 0) {

    })
    .catch((error) => {
        console.error("Error fetching listings:", error);
    });
}

function redirectToCategory(categoryId) {
    localStorage.setItem("categoryId", categoryId);
    window.location.href = `/category`;
}

function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId);
    window.location.href = `/listing/view`;
}
