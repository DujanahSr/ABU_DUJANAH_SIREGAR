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

  // Menyembunyikan menu samping saat halaman dimuat
  document.getElementById("side-panel").style.width = "0";

  openBtn.addEventListener("click", openNavMenu);
  closeBtn.addEventListener("click", closeNavMenu);
});

// Mendapatkan elemen doaHarianList dan searchInput dari DOM
const doaHarianListDiv = document.getElementById("list-doa");
const searchInput = document.getElementById("searchInput");


// Array untuk menyimpan data doa harian dari API
let dataDoa = [];

// Fungsi untuk mendapatkan data doa harian dari API
async function getDataFromAPI() {
  const apiUrl = "https://islamic-api-zhirrr.vercel.app/api/doaharian";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Fungsi untuk menampilkan daftar doa harian
async function tampilDoaHarian() {
  dataDoa = await getDataFromAPI();
  renderDoaList(dataDoa);
}

// Fungsi untuk menggambar daftar doa ke dalam DOM
function renderDoaList(doaList) {
  // Kosongkan elemen doaHarianList
  doaHarianListDiv.textContent = "";
  doaList.forEach((doa) => {
    // Buat elemen doaItem untuk setiap doa dan tambahkan ke doaHarianList
    const doaItem = createDoaItem(doa);
    doaHarianListDiv.appendChild(doaItem);
  });
}

// Fungsi untuk membuat elemen doa dengan detailnya
function createDoaItem(doa) {
  const doaItem = document.createElement("div");
  doaItem.classList.add("container");

  // Buat elemen doaTitle untuk judul doa
  const doaTitle = document.createElement("h3");
  doaTitle.textContent = doa.title;

  // Buat elemen doaArabicElement untuk teks arabic doa
  const doaArabicElement = document.createElement("p");
  doaArabicElement.classList.add("arabic-text");
  doaArabicElement.textContent = doa.arabic;

  // Buat element latin
  const doaLatin = document.createElement("p");
  doaLatin.classList.add("latin-text");
  doaLatin.textContent = doa.latin;
  
  // Buat elemen doaTranslationElement untuk teks terjemahan doa
  const doaTranslationElement = document.createElement("p");
  doaTranslationElement.classList.add("arti-text");
  doaTranslationElement.textContent = "Artinya: " + doa.translation;
  
  // Buat element copy dan send ke wa
  const copySendElement = document.createElement("div");
  copySendElement.classList.add("copy-send-container");
  
  // Tombol Send ke WA
  const iconSend = document.createElement("i");
  iconSend.setAttribute("class", "bx bxs-share-alt");
  iconSend.addEventListener("click", () => sendToWhatsApp(doa));

  // Tombol Copy
  const iconCopy = document.createElement("i");
  iconCopy.setAttribute("class", "bx bxs-copy-alt");
  iconCopy.addEventListener("click", () => copyDoa(doa));
  
  // tambah copy dan send ke copySendElement
  copySendElement.appendChild(iconCopy);
  copySendElement.appendChild(iconSend);
  
  // Tambahkan elemen-elemen ke dalam doaItem
  doaItem.appendChild(doaTitle);
  doaItem.appendChild(doaArabicElement);
  doaItem.appendChild(doaLatin);
  doaItem.appendChild(doaTranslationElement);
  doaItem.appendChild(copySendElement);
  
  return doaItem;
}
// Fungsi untuk menyalin doa ke clipboard dan menampilkan notifikasi
function copyDoa(doa) {
  const textToCopy = `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: ${doa.translation}`;
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      alert("Doa copied to clipboard");
    })
    .catch((err) => {
      alert("Failed to copy text: ", err);
    });
}


// Fungsi untuk mengirim teks doa ke WhatsApp
function sendToWhatsApp(doa) {
  const textToSend = `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: ${doa.translation}`;
  const encodedText = encodeURIComponent(textToSend);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, "_blank");
}

// Menambahkan event listener untuk input pada searchInput
searchInput.addEventListener("input", () => {
  // Ambil nilai pencarian dalam huruf kecil
  const searchTerm = searchInput.value.toLowerCase();
  // Filter dataDoa berdasarkan judul doa yang mengandung searchTerm
  const hasilPencarian = dataDoa.filter((doa) =>
    doa.title.toLowerCase().includes(searchTerm)
  );
  // Tampilkan hasil pencarian
  renderDoaList(hasilPencarian);
});

// Membuat tombol scroll to top
function createScrollToTopButton() {
  const button = document.createElement("button");
  button.id = "scrollToTop";
  button.className = "scroll-to-top";
  
  // Tambahkan ikon ke dalam tombol
  const icon = document.createElement("i");
  icon.className = 'bx bx-up-arrow-alt';
  button.appendChild(icon);
  
  // Tambahkan event listener untuk klik
  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Tambahkan tombol ke body
  document.body.appendChild(button);
}

// Menampilkan tombol scroll to top saat halaman digulir ke bawah
function handleScroll() {
  const scrollToTopButton = document.getElementById("scrollToTop");
  if (window.scrollY > 300) { // Tampilkan tombol jika digulir lebih dari 300px
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
}

// Inisialisasi tombol dan event listener
document.addEventListener("DOMContentLoaded", () => {
  createScrollToTopButton();
  window.addEventListener("scroll", handleScroll);
});


// Panggil fungsi tampilDoaHarian untuk menampilkan daftar doa harian pada saat halaman dimuat
tampilDoaHarian();