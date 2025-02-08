import { checkUserLoggedIn } from './utils.js';

const APIKEY = "678a13b229bb6d4dd6c56bd2";
const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
const IMAGES_URL = "/src/images/index.txt";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";

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
        document.getElementById("quantity").value = data.quantity;
        document.getElementById("image").value = data.image || "";
        document.getElementById("condition").value = data.condition || "New";
        document.getElementById("brand").value = data.brand || "";
        document.getElementById("dealMethod").value = data.dealMethod || "";
        document.getElementById("size").value = data.size || "";
        if (data.image) {
            document.getElementById("imagePreview").src = `/src/images/${data.image}`;
            document.getElementById("imagePreview").style.display = "block";
        }

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

            if (data.categories) {
                data.categories.forEach((category) => {
                    const option = categoriesSelect.querySelector(`option[value="${category._id}"]`);
                    if (option) {
                        option.selected = true;
                    }
                });
            }
        })
        .catch((error) => {
            console.error("Error loading categories:", error);
        });
    })
    .catch((error) => {
        console.error("Error fetching listing:", error);
        window.location.href = "/listing";
    });

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

    document.getElementById("image").addEventListener("change", (event) => {
        const selectedImage = event.target.value;
        const imagePreview = document.getElementById("imagePreview");
        if (selectedImage) {
            imagePreview.src = `/src/images/${selectedImage}`;
            imagePreview.style.display = "block";
        } else {
            imagePreview.style.display = "none";
        }
    });

    document.getElementById("editListingForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedCategories = Array.from(document.getElementById("categories").selectedOptions).map(option => option.value);

        const updatedListing = {
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
