document.addEventListener("DOMContentLoaded", () => {
    
    // Inject Stats on home page
    const statsContainer = document.getElementById("stats-dashboard");
    if (statsContainer) {
        const stats = [
            { label: "Driving Distance", value: "311.77y" },
            { label: "Driving Accuracy", value: "63.73%" },
            { label: "GIR", value: "72.9%" },
            { label: "Avg. Putts/GIR", value: "1.75" }
        ];
        
        stats.forEach(stat => {
            const div = document.createElement("div");
            div.className = "stat-card";
            div.innerHTML = `
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            `;
            statsContainer.appendChild(div);
        });
    }
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close mobile menu on link click
    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
});