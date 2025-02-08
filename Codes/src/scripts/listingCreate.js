import { checkUserLoggedIn } from './utils.js';

const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
const IMAGES_URL = "/src/images/index.txt";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn(); // Check if the user is logged in

    fetch(IMAGES_URL)
    .then((response) => response.text())
    .then((data) => {
        const imageSelect = document.getElementById("image");
        const images = data.split("\n").filter(Boolean);
        images.forEach((image) => {
            const option = document.createElement("option");
            option.value = image;
            option.textContent = image;
            imageSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error loading images:", error);
    });

    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((categoriesData) => {
        const categoriesSelect = document.getElementById("categories");
        categoriesData.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.categoryName;
            categoriesSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error loading categories:", error);
    });

    document.getElementById("createListingForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedCategories = Array.from(document.getElementById("categories").selectedOptions).map(option => option.value);

        const newListing = {
            sellerID: localStorage.getItem("loginId"),
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            image: document.getElementById("image").value,
            condition: document.getElementById("condition").value,
            brand: document.getElementById("brand").value,
            dealMethod: document.getElementById("dealMethod").value,
            size: document.getElementById("size").value,
            categories: selectedCategories,
        };

        fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify(newListing),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Listing created successfully:", data);
            window.location.href = "/listing";
        })
        .catch((error) => {
            console.error("Error creating listing:", error);
        });
    });
});
