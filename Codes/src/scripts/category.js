const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";

document.addEventListener("DOMContentLoaded", () => {
    const categoryId = localStorage.getItem("categoryId");
    fetchCategoryName(categoryId);
    fetchCategoryListings(categoryId);
});

function fetchCategoryName(categoryId) {
    fetch(`https://mokesell-2304.restdb.io/rest/categories/${categoryId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const categoryTitle = document.getElementById("category-title");
        categoryTitle.textContent = data.categoryName;
    })
    .catch((error) => {
        console.error("Error fetching category name:", error);
    });
}

function fetchCategoryListings(categoryId) {
    fetch(`${BASE_URL}?q={"categories._id":"${categoryId}","quantity":{"$gt":0}}&h={"$orderby": {"_changed": -1}}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const listingList = document.getElementById("listing-list");
        listingList.innerHTML = '';
        
        if (data.length === 0) {
            listingList.innerHTML = '<p>No listings available for this category.</p>';
        } else {
            data.forEach((listing) => {
                const listingItem = `
                    <div class="product-card" onclick="viewListing('${listing._id}')">
                        <img src="/src/images/${listing.image}" alt="${listing.title}">
                        <h3>${listing.title}</h3>
                        <p>${listing.description}</p>
                        <p>$${listing.price}</p>
                    </div>
                `;
                listingList.insertAdjacentHTML('beforeend', listingItem);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching listings:", error);
    });
}

function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId);
    window.location.href = `/listing/view`;
}
