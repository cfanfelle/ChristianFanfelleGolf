// ==========================================
// 1. YOUR DATA (UPDATE THIS SECTION ONLY)
// ==========================================

const myTournaments = [
    {
        name: "Texas State Open",
        date: "May 1-4, 2026",
        location: "Tyler, TX",
        result: "T-4 (-8)"
    },
    {
        name: "Q-School Stage 1",
        date: "Sept 12-15, 2026",
        location: "Mobile, AL",
        result: "Upcoming"
    },
    {
        name: "Mini Tour Championship",
        date: "Oct 20-23, 2026",
        location: "Orlando, FL",
        result: "Upcoming"
    }
];

const myStats = [
    { label: "Scoring Avg", value: "70.4" },
    { label: "Driving Distance", value: "312y" },
    { label: "Greens in Reg", value: "68%" },
    { label: "Pro Wins", value: "3" }
];


// ==========================================
// 2. WEBSITE LOGIC (DO NOT EDIT BELOW)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Inject Tournaments
    const scheduleContainer = document.getElementById("schedule-list");
    myTournaments.forEach(tourney => {
        const div = document.createElement("div");
        div.className = "schedule-item";
        div.innerHTML = `
            <div class="schedule-info">
                <h4>${tourney.name}</h4>
                <p>${tourney.date} | ${tourney.location}</p>
            </div>
            <div class="schedule-result">${tourney.result}</div>
        `;
        scheduleContainer.appendChild(div);
    });

    // Inject Stats
    const statsContainer = document.getElementById("stats-dashboard");
    myStats.forEach(stat => {
        const div = document.createElement("div");
        div.className = "stat-card";
        div.innerHTML = `
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        `;
        statsContainer.appendChild(div);
    });

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