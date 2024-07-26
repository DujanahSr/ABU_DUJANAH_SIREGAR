// Fungsi untuk membuka menu samping
function openNavMenu() {
  document.getElementById("side-panel").style.width = "200px";
}

// Fungsi untuk menutup menu samping
function closeNavMenu() {
  document.getElementById("side-panel").style.width = "0";
}

// Menambahkan event listener untuk tombol buka dan tutup menu samping
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.querySelector(".open-btn");
  const closeBtn = document.querySelector(".close-btn");
  const sidePanel = document.getElementById("side-panel");

  // Menyembunyikan menu samping saat halaman dimuat
  sidePanel.style.width = "0";

  openBtn.addEventListener("click", openNavMenu);
  closeBtn.addEventListener("click", closeNavMenu);
});

// event saat icons di click
document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark");
});

// feedback saat di submit
document
  .getElementById("feedback-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    if (name && email && phone && message) {
      document.getElementById("form-response").textContent =
        "Thank you for your feedback, " + name + "!";
    } else {
      document.getElementById("form-response").textContent =
        "Please fill in all fields.";
    }

    document.getElementById("feedback-form").reset();
  });
