// Set footer year automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Skill data (categories must match your filter button data-category values)
const skills = [
  {
    title: "Intro to JavaScript",
    category: "Programming",
    price: 25,
    instructor: "Devin U.",
    desc: "Learn variables, functions, and DOM basics with hands-on examples.",
    details: "Sessions are 60 minutes. Bring a laptop."
  },
  {
    title: "English Conversation",
    category: "Music",
    price: 18,
    instructor: "Maya K.",
    desc: "Practice speaking and build confidence for school or work.",
    details: "Conversation practice + pronunciation tips."
  },
  {
    title: "Fitness Coaching",
    category: "Career",
    price: 30,
    instructor: "Jordan S.",
    desc: "Beginner-friendly workouts and accountability check-ins.",
    details: "Custom plan based on your goals and schedule."
  },
  {
    title: "Career Prep",
    category: "Career",
    price: 22,
    instructor: "Sam R.",
    desc: "Resume review and mock interviews tailored to your field.",
    details: "Includes resume tips + interview practice."
  }
];

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

// Initial render
renderSkills(skills);

// Filter button clicks
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const category = btn.dataset.category;
  const filteredSkills = filterSkillsByCategory(skills, category);
  renderSkills(filteredSkills);
});
