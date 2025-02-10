import { checkUserLoggedIn } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn(); // Check if the user is logged in

    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
    const OFFERS_URL = "https://mokesell-2304.restdb.io/rest/offers";
    const MESSAGES_URL = "https://mokesell-2304.restdb.io/rest/messages";
    const listingId = localStorage.getItem("viewListingId");

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
        document.querySelector(".product-title").textContent = data.title;
        document.querySelector(".product-price").textContent = `S$${data.price}`;
        document.querySelector(".description-section p").textContent = data.description;
        document.querySelector(".product-info").innerHTML = `
            <p><strong>Condition:</strong> ${data.condition}</p>
            <p><strong>Brand:</strong> ${data.brand}</p>
            <p><strong>Size:</strong> ${data.size || "N/A"}</p>
            ${data.categories ? `<p><strong>Category:</strong> ${data.categories.map(cat => cat.categoryName).join(", ")}</p>` : ''}
        `;
        document.querySelector(".deal-method-section p").innerHTML = `${data.dealMethod} <span class="arrow">></span>`;
        document.querySelector(".seller-username").textContent = data.sellerID[0].username;
        document.querySelector(".image-section").innerHTML = `
            <img src="/src/images/${data.image}" alt="${data.title}" class="image-placeholder" />
        `;
        
        // Hide the purchase button if quantity is not greater than 0
        if (data.quantity <= 0) {
            document.getElementById('purchaseBtn').style.display = 'none';
        }

        // Add event listener to chat button
        document.querySelector(".btn-secondary").addEventListener("click", () => {
            localStorage.setItem("currentChat", data.sellerID[0]._id);
            window.location.href = "chat.html";
        });

        document.getElementById('purchaseBtn').addEventListener('click', () => {
            const purchaseModal = new bootstrap.Modal(document.getElementById('purchaseModal'));
            purchaseModal.show();
        });

        document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
            radio.addEventListener('change', (event) => {
                const creditCardInfo = document.getElementById('creditCardInfo');
                if (event.target.value === 'visa' || event.target.value === 'mastercard') {
                    creditCardInfo.style.display = 'block';
                } else {
                    creditCardInfo.style.display = 'none';
                }
            });
        });

        document.getElementById('sendOfferBtn').addEventListener('click', () => {
            const offerPrice = document.getElementById('offerPrice').value;
            const offerMessage = document.getElementById('offerMessage').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
            const from = localStorage.getItem("loginId");
            const to = data.sellerID[0]._id;

            if (!offerPrice || !offerMessage || !paymentMethod) {
                alert("Please fill in all required fields.");
                return;
            }

            if ((paymentMethod.value === 'visa' || paymentMethod.value === 'mastercard') && 
                (!document.getElementById('cardHolderName').value || 
                !document.getElementById('cardNumber').value || 
                !document.getElementById('cardExpiry').value || 
                !document.getElementById('cardCVC').value)) {
                alert("Please fill in all credit card details.");
                return;
            }

            // Create a new offer
            fetch(OFFERS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                },
                body: JSON.stringify({
                    listing: listingId,
                    from: from,
                    price: offerPrice,
                    paymentMethod: paymentMethod.value
                })
            })
            .then((response) => response.json())
            .then((offer) => {
                // Send a message with the offer
                fetch(MESSAGES_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                    },
                    body: JSON.stringify({
                        from: from,
                        to: to,
                        message: offerMessage,
                        sent: new Date().toISOString(),
                        offer: offer._id
                    })
                })
                .then((response) => response.json())
                .then(() => {
                    showOfferAnimation();
                    setTimeout(() => {
                        alert("Offer sent successfully!");
                        localStorage.setItem("currentChat", to);
                        window.location.href = "/chat";
                    }, 3000); // Show alert after animation
                })
                .catch((error) => {
                    console.error("Error sending message:", error);
                });
            })
            .catch((error) => {
                console.error("Error creating offer:", error);
            });
        });
    })
    .catch((error) => {
        console.error("Error fetching listing:", error);
        window.location.href = "/listing";
    });
});

function showOfferAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'animation-overlay';
    overlay.innerHTML = `
        <dotlottie-player src="https://lottie.host/9f216acb-8548-4bc1-8363-400b0100e82e/V3cM8D5RRj.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 3000); // Remove after 3 seconds
}
