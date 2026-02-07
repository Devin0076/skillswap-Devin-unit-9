// Set footer year automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Select all skill cards
const cards = document.querySelectorAll(".skill-card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const details = card.querySelector(".card-details");
    const isHidden = details.hasAttribute("hidden");

    // Hide all details first
    document.querySelectorAll(".card-details").forEach(d => {
      d.setAttribute("hidden", "");
    });

    document.querySelectorAll(".skill-card").forEach(c => {
      c.classList.remove("active");
    });

    // Show clicked card if it was hidden
    if (isHidden) {
      details.removeAttribute("hidden");
      card.classList.add("active");
    }
  });
});
