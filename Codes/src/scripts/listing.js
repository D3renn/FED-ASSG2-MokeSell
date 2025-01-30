import { checkUserLoggedIn } from './utils.js';

const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn(); // Check if the user is logged in

    const createListingButton = document.querySelector("#createListingBtn");

    createListingButton.addEventListener("click", () => {
        const sellerID = localStorage.getItem("loginId");
        const listingData = {
            sellerID: sellerID,
            title: "Title of Item",
            description: "Description of Item",
            price: 0,
            status: "draft",
            quantity: 1,
        };

        fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify(listingData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Listing created successfully:", data);
            localStorage.setItem("editListingId", data._id);
            window.location.href = `/listing/edit`;
        })
        .catch((error) => {
            console.error("Error creating listing:", error);
        });
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
                const listingCard = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h4 class="card-title">${listing.title}</h4>
                            <p class="card-text text-muted">Description: ${listing.description}</p>
                            <p class="card-text text-muted">Price: $${listing.price}</p>
                            <p class="card-text text-muted">Status: ${listing.status}</p>
                            <p class="card-text text-muted">Quantity: ${listing.quantity}</p>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-secondary me-2" onclick="editListing('${listing._id}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteListing('${listing._id}')">Delete</button>
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