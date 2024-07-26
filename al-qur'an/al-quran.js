// Menyimpan daftar surah yang diambil dari API
let surahList = [];
// Menyimpan query pencarian terakhir
let lastSearchQuery = "";

// Fungsi untuk mengambil dan menampilkan daftar surah
async function surah() {
  try {
    // Logging bahwa data sedang diambil
    console.log("Fetching data...");

    // Mengambil data surah dari API
    const response = await fetch("https://quran-api-id.vercel.app/surahs");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Mengubah respons menjadi JSON
    const res = await response.json();
    console.log("Data fetched:", res);

    // Memeriksa format respons
    if (!res || !Array.isArray(res)) {
      throw new Error("Format respons yang tidak diketahui");
    }

    // Menyimpan daftar surah dan menampilkannya
    surahList = res;
    displaySurahList(surahList);
  } catch (error) {
    // Menangani kesalahan
    console.error("Error : ", error);
  }
}

// Fungsi untuk menampilkan daftar surah
function displaySurahList(list) {
  // Mendapatkan elemen container untuk menampilkan surah
  const container = document.querySelector(".container");

  // Menghapus semua elemen anak dari container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Membuat elemen HTML untuk setiap surah dalam daftar
  list.forEach((surah) => {
    const surahFigure = document.createElement("figure");
    surahFigure.className = "surah-figure";

    const figcaptionTitle = document.createElement("figcaption");
    figcaptionTitle.textContent = `${surah.number}. ${surah.name} (${surah.translation})`;
    figcaptionTitle.classList.add("nama-surah");

    const ayatP = document.createElement("p");
    ayatP.textContent = `Jumlah ayat : ${surah.numberOfAyahs}`;
    ayatP.classList.add("jumlah-ayat");

    // Menambahkan event listener untuk setiap elemen surah
    surahFigure.addEventListener("click", () => {
      showSurahDetails(surah.number);
    });

    // Menambahkan elemen ke dalam figure
    surahFigure.appendChild(figcaptionTitle);
    surahFigure.appendChild(ayatP);

    // Menambahkan figure ke dalam container
    container.appendChild(surahFigure);
  });
}

// Fungsi untuk menyembunyikan input pencarian
function hideSearchInput() {
  const searchContainer = document.querySelector(".input-container");
  if (searchContainer) {
    searchContainer.style.display = "none";
  }
}

// Fungsi untuk menampilkan input pencarian
function showSearchInput() {
  const searchContainer = document.querySelector(".input-container");
  if (searchContainer) {
    searchContainer.style.display = "flex";
  }
}

// Fungsi untuk mencari surah berdasarkan input
function searchSurah(event) {
  // Mengambil nilai input pencarian dan mengubahnya menjadi huruf kecil
  lastSearchQuery = event.target.value.toLowerCase();

  // Memfilter daftar surah berdasarkan input
  const filteredList = surahList.filter((surah) => {
    return (
      surah.name.toLowerCase().includes(lastSearchQuery) ||
      surah.translation.toLowerCase().includes(lastSearchQuery)
    );
  });

  // Menampilkan daftar surah yang telah difilter
  displaySurahList(filteredList);
}

// Variabel untuk menyimpan audio yang sedang aktif, status tampilan daftar surah, dan elemen audio ayat
let activeAudio = null;
let isSurahListVisible = true;
let currentAyahIndex = 0;
let ayahAudioElements = [];

// Fungsi untuk menampilkan detail surah berdasarkan nomor surah
async function showSurahDetails(surahNumber) {
  try {
    // Mengambil data detail surah dari API
    const response = await fetch(
      `https://quran-api-id.vercel.app/surahs/${surahNumber}`
    );
    const data = await response.json();

    // Membuat elemen halaman untuk detail surah
    const surahDetailsPage = document.createElement("div");
    surahDetailsPage.classList.add("surah-details-page");

    // Membuat dan menambahkan elemen header untuk detail surah
    const divHead = document.createElement("div");
    divHead.classList.add("div-contain");
    surahDetailsPage.appendChild(divHead);

    // Menambahkan judul surah ke header
    const judulSurah = document.createElement("h1");
    judulSurah.classList.add("judul-surah");
    judulSurah.textContent = data.name;
    divHead.appendChild(judulSurah);

    // Menambahkan paragraf yang berisi informasi surah
    const paragSurah = document.createElement("p");
    paragSurah.classList.add("parag-surah");
    paragSurah.textContent = `${data.revelation} - ${data.translation} - ${data.numberOfAyahs} Ayat`;
    divHead.appendChild(paragSurah);

    // Menambahkan deskripsi surah ke header
    const descriptionSurah = document.createElement("p");
    descriptionSurah.classList.add("description");
    descriptionSurah.textContent = data.description;
    divHead.appendChild(descriptionSurah);

    // Membuat elemen daftar untuk ayat-ayat surah
    const ayahList = document.createElement("ol");
    ayahList.classList.add("ayat-surah");
    surahDetailsPage.appendChild(ayahList);

    // Mengambil data ayat dari API untuk surah yang dipilih
    const ayahResponse = await fetch(
      `https://quran-api-id.vercel.app/surahs/${surahNumber}/ayahs`
    );
    const ayahData = await ayahResponse.json();

    // Inisialisasi array untuk elemen audio dan indeks ayat saat ini
    ayahAudioElements = [];
    currentAyahIndex = 0;

    // Menambahkan setiap ayat ke daftar
    ayahData.forEach((ayah, index) => {
      // Membuat elemen untuk setiap ayat
      const listItem = document.createElement("li");
      listItem.id = `ayah-${index}`; // Menambahkan ID unik pada setiap ayat

      const ayatImageContainer = document.createElement("div");
      ayatImageContainer.classList.add("ayat-image");

      const arab = document.createElement("p");
      arab.classList.add("arabic");
      arab.textContent = ayah.arab;

      const ayahNumber = document.createElement("p");
      ayahNumber.classList.add("ayah-number");
      ayahNumber.textContent = `Ayat ke - ${index + 1}`;

      const pAyah = document.createElement("p");
      pAyah.classList.add("arti");
      pAyah.textContent = ayah.translation;

      const audioPlayer = document.createElement("audio");
      audioPlayer.controls = true;
      const audioLink = ayah.audio.alafasy;
      if (audioLink) {
        audioPlayer.src = audioLink;

        // Menangani event ketika audio mulai diputar
        audioPlayer.addEventListener("play", () => {
          if (activeAudio && activeAudio !== audioPlayer) {
            activeAudio.pause();
          }
          activeAudio = audioPlayer;
          currentAyahIndex = index;

          // Menggulung ke ayat yang sedang diputar
          const currentAyahElement = document.getElementById(
            `ayah-${currentAyahIndex}`
          );
          if (currentAyahElement) {
            currentAyahElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });
      }
      // Menangani event ketika audio selesai diputar
      audioPlayer.addEventListener("ended", () => {
        currentAyahIndex++;
        if (currentAyahIndex < ayahAudioElements.length) {
          const nextAyahElement = document.getElementById(
            `ayah-${currentAyahIndex}`
          );
          if (nextAyahElement) {
            nextAyahElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          ayahAudioElements[currentAyahIndex].play();
        }
      });
      ayahAudioElements.push(audioPlayer);

      // Menambahkan elemen ayat ke daftar
      listItem.appendChild(ayahNumber);
      listItem.appendChild(ayatImageContainer);
      listItem.appendChild(arab);
      listItem.appendChild(pAyah);
      listItem.appendChild(audioPlayer);
      ayahList.appendChild(listItem);
    });

    // Menyembunyikan input pencarian
    hideSearchInput();

    // Menyembunyikan daftar surah dan menampilkan detail surah
    const surahListDiv = document.querySelector(".container");
    const surahDetailsDiv = document.querySelector(".detail-container");

    if (isSurahListVisible) {
      surahListDiv.style.display = "none";
      isSurahListVisible = false;
    }

    while (surahDetailsDiv.firstChild) {
      surahDetailsDiv.removeChild(surahDetailsDiv.firstChild);
    }

    surahDetailsDiv.appendChild(surahDetailsPage);

    // Membuat dan menambahkan tombol navigasi (Sebelumnya, Kembali, Selanjutnya)
    const navBottom = document.createElement("div");
    navBottom.classList.add("nav-bottom");

    // Menambahkan tombol Surat Sebelumnya jika bukan surah pertama
    if (surahNumber > 1) {
      const prevSurahButton = document.createElement("button");
      prevSurahButton.textContent = "Surat Sebelumnya";
      prevSurahButton.addEventListener("click", async () => {
        await showSurahDetails(surahNumber - 1);
      });
      navBottom.appendChild(prevSurahButton);
    }

    // Menambahkan tombol Kembali
    const backButton = document.createElement("button");
    backButton.textContent = "Kembali";
    backButton.addEventListener("click", () => {
      // Menampilkan kembali daftar surah dan menyembunyikan detail surah
      const surahListDiv = document.querySelector(".container");
      const surahDetailsDiv = document.querySelector(".detail-container");

      // Menampilkan daftar surah
      surahListDiv.style.display = "flex";

      // Menghapus semua elemen anak dari surahDetailsDiv
      while (surahDetailsDiv.firstChild) {
        surahDetailsDiv.removeChild(surahDetailsDiv.firstChild);
      }

      // Menampilkan input pencarian
      showSearchInput();

      // Mengatur nilai input pencarian
      const searchInput = document.getElementById("search-input");
      searchInput.value = lastSearchQuery;

      // Menampilkan daftar surah yang difilter
      const filteredList = surahList.filter((surah) => {
        return (
          surah.name.toLowerCase().includes(lastSearchQuery) ||
          surah.translation.toLowerCase().includes(lastSearchQuery)
        );
      });
      displaySurahList(filteredList.length > 0 ? filteredList : surahList);

      isSurahListVisible = true;
    });
    navBottom.appendChild(backButton);

    // Menambahkan tombol Surat Selanjutnya jika bukan surah terakhir
    if (surahNumber < 114) {
      const nextSurahButton = document.createElement("button");
      nextSurahButton.textContent = "Surat Selanjutnya";
      nextSurahButton.addEventListener("click", async () => {
        await showSurahDetails(surahNumber + 1);
      });
      navBottom.appendChild(nextSurahButton);
    }

    // Menambahkan tombol navigasi ke halaman detail surah
    surahDetailsPage.appendChild(navBottom);
  } catch (error) {
    console.error("Error fetching surah details:", error);
  }
}

// Menjalankan fungsi surah saat dokumen dimuat
document.addEventListener("DOMContentLoaded", surah);

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

// Menambahkan event listener untuk input pencarian
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchSurah);