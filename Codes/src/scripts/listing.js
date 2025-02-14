import { checkUserLoggedIn } from './utils.js';

const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn(); // Check if the user is logged in

    const createListingButton = document.querySelector("#createListingBtn");

    createListingButton.addEventListener("click", () => {
        window.location.href = "/listing/create";
    });

    fetchUserListings();
});

function fetchUserListings() {
    const sellerID = localStorage.getItem("loginId");
    fetch(`${BASE_URL}?q={"sellerID._id":"${sellerID}"}&h={"$orderby": {"_changed": -1}}`, {
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
            listingList.innerHTML = '<p>No listings available. Create a new listing to get started.</p>';
        } else {
            data.forEach((listing) => {
                const categories = listing.categories ? listing.categories.map(category => `<span class="badge bg-secondary">${category.categoryName}</span>`).join(' ') : '';
                const condition = listing.condition ? `<p class="card-text text-muted">Condition: ${listing.condition}</p>` : '';
                const brand = listing.brand ? `<p class="card-text text-muted">Brand: ${listing.brand}</p>` : '';
                const dealMethod = listing.dealMethod ? `<p class="card-text text-muted">Deal Method: ${listing.dealMethod}</p>` : '';
                const size = listing.size ? `<p class="card-text text-muted">Size: ${listing.size}</p>` : '';
                const listingCard = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex">
                                <img src="/src/images/${listing.image}" alt="${listing.title}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px;">
                                <div>
                                    <h4 class="card-title">${listing.title}</h4>
                                    <p class="card-text text-muted">Description: ${listing.description}</p>
                                    <p class="card-text text-muted">Price: $${listing.price}</p>
                                    <p class="card-text text-muted">Quantity: ${listing.quantity}</p>
                                    ${condition}
                                    ${brand}
                                    ${dealMethod}
                                    ${size}
                                    <p class="card-text text-muted">Categories: ${categories}</p>
                                    <div class="d-flex justify-content-end">
                                        <button class="btn btn-secondary me-2" onclick="editListing('${listing._id}')">Edit</button>
                                        <button class="btn btn-danger" onclick="deleteListing('${listing._id}')">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                listingList.insertAdjacentHTML('beforeend', listingCard);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching listings:", error);
    });
}

window.editListing = function(listingId) {
    localStorage.setItem("editListingId", listingId);
    window.location.href = `/listing/edit`;
}

window.deleteListing = function(listingId) {
    if (confirm("Are you sure you want to delete this listing?")) {
        fetch(`${BASE_URL}/${listingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Listing deleted successfully:", data);
            fetchUserListings();
        })
        .catch((error) => {
            console.error("Error deleting listing:", error);
        });
    }
}
