function openModal(src) {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");

  modalImage.src = src;
  modal.style.display = "flex";

  // 背景クリックで閉じる処理
  modal.onclick = function(event) {
    // 画像自身をクリックしたときは閉じない
    if (event.target === modal) {
      closeModal();
    }
  };
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}