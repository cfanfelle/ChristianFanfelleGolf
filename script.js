document.addEventListener("DOMContentLoaded", () => {
    // Inject Stats on home page
    const statsContainer = document.getElementById("stats-dashboard");
    if (statsContainer) {
        const stats = [
            { label: "Driving Distance", value: "311.77y", detail: "Average distance off the tee" },
            { label: "Driving Accuracy", value: "63.73%", detail: "Fairways hit from the tee" },
            { label: "Greens in Regulation", value: "72.9%", detail: "Greens reached in regulation" },
            { label: "Average Putts per GIR", value: "1.75", detail: "Putting average after hitting the green" }
        ];
        
        stats.forEach(stat => {
            const div = document.createElement("div");
            div.className = "stat-card";
            div.innerHTML = `
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
                <div class="stat-description">${stat.detail}</div>
            `;
            statsContainer.appendChild(div);
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Stripe donation checkout
    const donationButtons = document.querySelectorAll(".donation-button");
    const customDonationToggle = document.getElementById("custom-donation-toggle");
    const customDonationForm = document.getElementById("custom-donation-form");
    const customDonationAmount = document.getElementById("custom-donation-amount");
    const donationMessage = document.getElementById("donation-message");
    const queryParams = new URLSearchParams(window.location.search);
    const checkoutStatus = queryParams.get("checkout");

    if (checkoutStatus === "success" && donationMessage) {
        donationMessage.textContent = "Thank you for the support. Your donation was processed successfully.";
        donationMessage.classList.add("success");
    }

    if (checkoutStatus === "cancelled" && donationMessage) {
        donationMessage.textContent = "Checkout was cancelled. No donation was processed.";
        donationMessage.classList.add("error");
    }

    async function startDonationCheckout(amount, activeButton) {
        const originalText = activeButton ? activeButton.textContent : "";

        donationButtons.forEach(item => {
            item.disabled = true;
        });

        if (customDonationToggle) {
            customDonationToggle.disabled = true;
        }

        if (activeButton) {
            activeButton.textContent = "Opening checkout...";
        }

        if (donationMessage) {
            donationMessage.textContent = "";
            donationMessage.className = "donation-message";
        }

        try {
            const response = await fetch("/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
            });
            const contentType = response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                throw new Error("Donation checkout is not available on this page. Please open the site through the Node server.");
            }

            const result = await response.json();

            if (!response.ok || !result.url) {
                throw new Error(result.error || "Unable to start checkout.");
            }

            window.location.href = result.url;
        } catch (error) {
            if (donationMessage) {
                donationMessage.textContent = error.message;
                donationMessage.classList.add("error");
            }
            donationButtons.forEach(item => {
                item.disabled = false;
            });
            if (customDonationToggle) {
                customDonationToggle.disabled = false;
            }
            if (activeButton) {
                activeButton.textContent = originalText;
            }
        }
    }

    donationButtons.forEach(button => {
        button.addEventListener("click", () => {
            startDonationCheckout(Number(button.dataset.amount), button);
        });
    });

    if (customDonationToggle && customDonationForm && customDonationAmount) {
        customDonationToggle.addEventListener("click", () => {
            customDonationForm.hidden = !customDonationForm.hidden;

            if (!customDonationForm.hidden) {
                customDonationAmount.focus();
            }
        });

        customDonationForm.addEventListener("submit", event => {
            event.preventDefault();

            const dollars = Number(customDonationAmount.value);

            if (!Number.isFinite(dollars) || dollars < 5 || dollars > 10000) {
                if (donationMessage) {
                    donationMessage.textContent = "Enter a donation amount between $5 and $10,000.";
                    donationMessage.className = "donation-message error";
                }
                return;
            }

            startDonationCheckout(Math.round(dollars * 100), customDonationForm.querySelector("button"));
        });
    }

    if (navLinks) {
        document.querySelectorAll(".nav-links li a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }
});
