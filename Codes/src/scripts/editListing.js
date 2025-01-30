import { checkUserLoggedIn } from './utils.js';

const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn(); // Check if the user is logged in

    const listingId = localStorage.getItem("editListingId");

    if (!listingId) {
        window.location.href = "/listing";
        return;
    }

    fetch(`${BASE_URL}/${listingId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const sellerID = localStorage.getItem("loginId");
        if (data.sellerID[0]._id !== sellerID) {
            window.location.href = "/listing";
            return;
        }

        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;
        document.getElementById("price").value = data.price;
        document.getElementById("status").value = data.status;
        document.getElementById("quantity").value = data.quantity;
    })
    .catch((error) => {
        console.error("Error fetching listing:", error);
        window.location.href = "/listing";
    });

    document.getElementById("editListingForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedListing = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            status: document.getElementById("status").value,
            quantity: document.getElementById("quantity").value,
        };

        fetch(`${BASE_URL}/${listingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify(updatedListing),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Listing updated successfully:", data);
            window.location.href = "/listing";
        })
        .catch((error) => {
            console.error("Error updating listing:", error);
        });
    });
});