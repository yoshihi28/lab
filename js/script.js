// モーダルを開く関数
function openModal(imageSrc) {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");

  modal.style.display = "flex"; // モーダル表示
  modalImage.src = imageSrc; // クリックした画像を表示
}

// モーダルを閉じる関数
function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none"; // モーダル非表示
}