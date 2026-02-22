// Set footer year automatically
document.getElementById("year").textContent = new Date().getFullYear();

let skills = [];

// Filter function for the UI (browser can’t use require/module.exports without a bundler)
function filterSkillsByCategory(skillsList, category) {
  if (!Array.isArray(skillsList)) return [];
  if (category === "All") return skillsList;
  return skillsList.filter((skill) => skill.category === category);
}

const cardsGrid = document.getElementById("cardsGrid");

function attachCardToggleHandlers() {
  const cards = document.querySelectorAll(".skill-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const details = card.querySelector(".card-details");
      const isHidden = details.hasAttribute("hidden");

      // Hide all details first
      document.querySelectorAll(".card-details").forEach((d) => {
        d.setAttribute("hidden", "");
      });

      // Remove active class from all cards
      document.querySelectorAll(".skill-card").forEach((c) => {
        c.classList.remove("active");
      });

      // Show clicked card if it was hidden
      if (isHidden) {
        details.removeAttribute("hidden");
        card.classList.add("active");
      }
    });
  });
}

function renderSkills(list) {
  if (!cardsGrid) return;

  cardsGrid.innerHTML = "";

  list.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <h4>${skill.title}</h4>
      <p class="card-desc">${skill.desc}</p>
      <p class="card-meta"><strong>$${skill.price}/hr</strong> • ${skill.instructor}</p>
      <p class="card-details" hidden>${skill.details}</p>
    `;

    cardsGrid.appendChild(card);
  });

  // Re-attach click behavior after rendering new cards
  attachCardToggleHandlers();
}

async function loadSkills() {
  try {
    const apiSkills = await window.apiService.fetchSkills();

    skills = apiSkills.map((s) => ({
      title: s.title,
      category: s.category,
      price: s.price,
      instructor: s.provider,
      desc: s.description,
      details: ''
    }));

    renderSkills(skills);
  } catch (error) {
    console.error(error);
    if (cardsGrid) {
      cardsGrid.innerHTML = "<p>Failed to load skills.</p>";
    }
  }
}

// Initial load from API
loadSkills();

// Filter button clicks
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const category = btn.dataset.category;
  const filteredSkills = filterSkillsByCategory(skills, category);
  renderSkills(filteredSkills);
});


function calculateTotalCost(hourlyRate, hours) {
  return hourlyRate * hours;
}

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
  calculateBtn.addEventListener("click", () => {
    const rate = parseFloat(document.getElementById("rateInput").value);
    const hours = parseFloat(document.getElementById("hoursInput").value);

    const total = calculateTotalCost(rate, hours);

    document.getElementById("totalResult").textContent =
      "Total Cost: $" + total;
  });
}


function matchSkillsToUser(userNeeds, skillsList) {
  if (!userNeeds || !Array.isArray(skillsList)) return [];

  return skillsList.filter((skill) => {
    return (
      skill.category === userNeeds.category &&
      skill.price <= userNeeds.maxPrice
    );
  });
}

const matchBtn = document.getElementById("matchBtn");

if (matchBtn) {
  matchBtn.addEventListener("click", () => {
    const category = document.getElementById("matchCategory").value;
    const maxPrice = parseFloat(document.getElementById("matchMaxPrice").value);

    const matches = matchSkillsToUser({ category, maxPrice }, skills);

    const results = document.getElementById("matchResults");
    results.innerHTML = "";

    if (matches.length === 0) {
      results.textContent = "No matches found.";
      return;
    }

    matches.forEach((skill) => {
      const card = document.createElement("article");
      card.className = "skill-card";
      card.tabIndex = 0;

      card.innerHTML = `
        <h4>${skill.title}</h4>
        <p class="card-desc">${skill.desc}</p>
        <p class="card-meta"><strong>$${skill.price}/hr</strong> • ${skill.instructor}</p>
        <p class="card-details" hidden>${skill.details}</p>
      `;

      results.appendChild(card);
    });
  });
}
