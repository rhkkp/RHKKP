 function vote(btn) {
  let fuel = btn.previousElementSibling;
  let votes = parseInt(fuel.getAttribute("data-votes")) + 1;

  fuel.setAttribute("data-votes", votes);
  fuel.classList.remove("red-active", "yellow-active", "green-active");

  if (votes >= 50 && votes < 100) {
    fuel.classList.add("red-active");
  } else if (votes === 100) {
    fuel.classList.add("yellow-active");
  } else if (votes > 100) {
    fuel.classList.add("green-active");
  }

  console.log("Admin votes:", votes);
}// Disable right click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Disable drag on images
document.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

// Disable common save shortcuts
document.addEventListener("keydown", function (e) {
  if (
    e.ctrlKey && 
    (e.key === "s" || e.key === "u" || e.key === "i")
  ) {
    e.preventDefault();
  }
});
// --- NEW: MONGODB REGISTRATION (Ehnu end te add karo) ---
document.getElementById('talentForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Page refresh hon ton rokan layi

    const name = document.getElementById('userName').value;
    const category = document.getElementById('userCategory').value;

    try {
        const response = await fetch('http://localhost:3000/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // ✅ Data MongoDB vich save ho gya!
            document.getElementById('talentForm').reset();
        } else {
            alert("❌ Galti ho gayi!");
        }
    } catch (err) {
        alert("❌ Server band hai! Pehla terminal vich 'node server.js' chalao.");
    }
});