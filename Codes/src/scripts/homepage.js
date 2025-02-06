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
            document.getElementById("product-list").innerHTML = '<p>No listings available.</p>';
            return;
        }

        const categoryListings = {}; // Store listings per category

        data.forEach((listing) => {
            if (!listing.categories) return;

            listing.categories.forEach((category) => {
                const categoryName = category.categoryName.toLowerCase();
                let categorySection = document.querySelector(`.product-section[data-category="${categoryName}"]`);

                if (!categorySection) {
                    categorySection = document.createElement('div');
                    categorySection.classList.add('product-section');
                    categorySection.setAttribute('data-category', categoryName);
                    categorySection.innerHTML = `
                        <div class="section-header">
                            <h2>${category.categoryName}</h2>
                            <button class="view-all" onclick="redirectToCategory('${category._id}')">View All</button>
                        </div>
                        <div class="product-scroll" id="${categoryName}-list"></div>
                    `;
                    document.getElementById("product-list").appendChild(categorySection);
                }

                // Ensure at least 5 products per category
                if (!categoryListings[categoryName]) categoryListings[categoryName] = [];
                categoryListings[categoryName].push(listing);
            });
        });

        // Append listings to respective categories
        Object.keys(categoryListings).forEach((categoryName) => {
            const categoryList = document.getElementById(`${categoryName}-list`);
            categoryList.innerHTML = ''; // Clear the loading text

            categoryListings[categoryName].forEach((listing) => {
                const listingCard = `
                    <div class="product-card" onclick="viewListing('${listing._id}')">
                        <img src="/src/images/${listing.image}" alt="${listing.title}">
                        <h3>${listing.title}</h3>
                        <p>${listing.description}</p>
                        <p>$${listing.price}</p>
                    </div>
                `;
                categoryList.insertAdjacentHTML('beforeend', listingCard);
            });

            // Duplicate product cards if category has fewer than 5 listings
            while (categoryList.children.length < 5) {
                categoryList.insertAdjacentHTML('beforeend', categoryList.innerHTML);
            }
        });
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
