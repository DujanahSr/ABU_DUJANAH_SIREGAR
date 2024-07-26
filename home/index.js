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

// Js fungsi untuk slide image
let start = 0;
otomatis();

function otomatis(){
  const slider = document.querySelectorAll('.slide');
  // console.log(slider);
  
  for (let i = 0; i < slider.length; i++){
    slider[i].style.display='none';
  }
  if(start >= slider.length){
    start = 0;
  }
  slider[start].style.display='block';
  start++;
  // Image akan berganti setiap 2 detik
  setTimeout(otomatis, 2000);
}