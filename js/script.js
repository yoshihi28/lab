// モーダルを開く関数
function openModal(imageSrc) {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");

  modal.style.display = "flex"; // モーダル表示
  modalImage.src = imageSrc; // クリックした画像を表示
}

// モーダルを閉じる関数
function closeModal(event) {
  const modal = document.getElementById("myModal");
  
  // モーダルの内容（画像など）をクリックした場合は閉じない
  if (event.target === modal) {
    modal.style.display = "none"; // モーダル非表示
  }
}