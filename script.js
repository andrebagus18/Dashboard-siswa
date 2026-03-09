// inisialisasi html
const btnSave = document.getElementById("simpanBtn");
const bodyTable = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const totalSiswa = document.getElementById("totalSiswa");
const rataKelas = document.getElementById("rataKelas");
const nilaiTertinggi = document.getElementById("nilaiTertinggi");
const nilaiTerendah = document.getElementById("nilaiTerendah");
const editModal = document.getElementById("editModal");
const closeModal = document.querySelectorAll(".closeModal");
const update = document.getElementById("updateBtn");
const refresh = document.getElementById("refreshBtn");

//data siswa
const students = [
  {
    id: 1,
    nama: "Andre Bagus",
    nilai: { matematika: 85, ipa: 78, bInggris: 82 },
  },
  {
    id: 2,
    nama: "Ani Wijayanti",
    nilai: { matematika: 92, ipa: 88, bInggris: 95 },
  },
  {
    id: 3,
    nama: "Citra Dewi",
    nilai: { matematika: 76, ipa: 82, bInggris: 79 },
  },
  {
    id: 4,
    nama: "Dodi Prasetyo",
    nilai: { matematika: 88, ipa: 85, bInggris: 80 },
  },
  {
    id: 5,
    nama: "Eko Saputra",
    nilai: { matematika: 67, ipa: 72, bInggris: 70 },
  },
];

// logika edit dan laci data(penggabungan data)
let dataUsers = JSON.parse(localStorage.getItem("dataUsers")) || [...students];
let isEdit = null;

//fungsi hitung rata rata
function sumRata() {
  let dataRata = dataUsers.map((s) => {
    let total =
      Number(s.nilai.matematika) +
      Number(s.nilai.ipa) +
      Number(s.nilai.bInggris);
    return { ...s, rataSiswa: total / 3 };
  });
  dataRata.sort((a, b) => b.rataSiswa - a.rataSiswa);
  return dataRata;
}
sumRata();

// event button submit/tambah siswa
btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  let inputName = document.getElementById("namaInput").value;
  let inputMath = document.getElementById("mathInput").value;
  let inputIpa = document.getElementById("ipaInput").value;
  let inputEnglish = document.getElementById("englishInput").value;

  //penggabungan id sesuai id data yang sudah ada
  let allID = dataUsers.map((user) => Number(user.id) || 0);
  let newId = allID.length ? Math.max(...allID) : 0;
  let idNew = newId + 1;

  //simpan data baru
  let dataUser = {
    id: idNew,
    nama: inputName,
    nilai: {
      matematika: Number(inputMath),
      ipa: Number(inputIpa),
      bInggris: Number(inputEnglish),
    },
  };
  dataUsers = [...dataUsers, dataUser];
  saveToLocalStorage();
  inputEmpty();
  tableSiswa();
});

//fungsi render table
function tableSiswa() {
  bodyTable.innerHTML = "";
  // inisialisasi state empty
  if (dataUsers.length === 0) {
    emptyState.style.display = "block";
    totalSiswa.textContent = 0;
    rataKelas.textContent = 0;
    nilaiTertinggi.textContent = 0;
    nilaiTerendah.textContent = 0;
    return;
  }
  emptyState.style.display = "none";

  // variabel untuk logo dan medali ranking
  let iClass = "";
  let iIcon = "";
  // tangkap fungsi hitung rata rata untuk foreach tabel
  let hasilDataRata = sumRata();
  // code untuk stats data siswa
  let rateKelas = hasilDataRata.reduce((acc, s) => acc + s.rataSiswa, 0);
  let totalRate = rateKelas / dataUsers.length;
  let nilaiTinggi = Math.max(...hasilDataRata.map((n) => n.rataSiswa));
  let nilaiRendah = Math.min(...hasilDataRata.map((n) => n.rataSiswa));
  totalSiswa.textContent = dataUsers.length;
  rataKelas.textContent = totalRate.toFixed(2);
  nilaiTertinggi.textContent = nilaiTinggi.toFixed(2);
  nilaiTerendah.textContent = nilaiRendah.toFixed(2);
  // render tabel
  hasilDataRata.forEach((item, index) => {
    if (index === 0) {
      iClass = "rank-1";
      iIcon = '<i class="fas fa-crown"></i>';
    } else if (index === 1) {
      iClass = "rank-2";
      iIcon = '<i class="fas fa-medal"></i>';
    } else if (index === 2) {
      iClass = "rank-3";
      iIcon = '<i class="fas fa-star"></i>';
    } else {
      iClass = "rank-normal";
      iIcon = '<i class="fas fa-hashtag"></i>';
    }

    bodyTable.innerHTML += ` <tr>
                  <td><span class='rank-badge ${iClass}'>
                  ${iIcon} #${index + 1}</span>
                  </td>
                  <td><strong>${item.nama}</strong></td>
                  <td>${item.nilai.matematika}</td>
                  <td>${item.nilai.ipa}</td>
                  <td>${item.nilai.bInggris}</td>
                  <td><strong>${item.rataSiswa.toFixed(2)}</strong></td>
                  <td><div class='action-btns'>
                    <button class='action-btn edit-btn' onclick="editSiswa('${item.id}')">
                    <i class='fas fa-edit'></i></button>
                    <button class='action-btn delete-btn' onclick="deleteSiswa('${item.id}')">
                    <i class='fas fa-trash'></i></button>
                  </div></td>
                </tr>`;
  });
}
tableSiswa();

// fungsi edit siswa
function editSiswa(id) {
  let editNama = document.getElementById("editNama");
  let editMath = document.getElementById("editMath");
  let editIpa = document.getElementById("editIpa");
  let editEnglish = document.getElementById("editEnglish");
  isEdit = id;
  dataUsers[isEdit];
  // isi kolom input edit dan temukan id yang diedit sesuai tombol edit yang di klik
  let student = dataUsers.find((s) => s.id == id);
  editNama.value = student.nama;
  editMath.value = student.nilai.matematika;
  editIpa.value = student.nilai.ipa;
  editEnglish.value = student.nilai.bInggris;
  // modal edit muncul
  editModal.classList.add("active");
  // event update edit dan simpan data edit ke laci baru
  update.addEventListener("click", () => {
    let updateData = {
      id: isEdit,
      nama: editNama.value,
      nilai: {
        matematika: editMath.value,
        ipa: editIpa.value,
        bInggris: editEnglish.value,
      },
    };
    // inisialisasi untuk id edit sesuai data edit
    let hasilUpdate = dataUsers.map((user) => {
      if (user.id == isEdit) {
        console.log(user.id);
        return updateData;
      }
      return user;
    });
    dataUsers = hasilUpdate;
    isEdit = null;
    modalClose();
    saveToLocalStorage();
    sumRata();
    tableSiswa();
  });
}

//fungsi hapus siswa
function deleteSiswa(id) {
  let delSiswa = dataUsers.filter((user) => user.id != id);
  dataUsers = delSiswa;
  saveToLocalStorage();
  tableSiswa();
  sumRata();
}

// refresh table
refresh.addEventListener("click", () => {
  tableSiswa();
});

//close modal
function modalClose() {
  editModal.classList.remove("active");
}
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    modalClose();
  }
});
closeModal.forEach((close) => {
  close.addEventListener("click", modalClose);
});

// empty form
function inputEmpty() {
  document.querySelectorAll("input").forEach((inp) => (inp.value = ""));
}
// save to Local
function saveToLocalStorage() {
  localStorage.setItem("dataUsers", JSON.stringify(dataUsers));
}
