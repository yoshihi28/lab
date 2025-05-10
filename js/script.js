function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(section => {
    const isTarget = section.dataset.tab === tabName;
    section.hidden = !isTarget;

    if (isTarget) {
      section.querySelectorAll("img").forEach(img => {
        if (!img.src) {
          img.src = img.dataset.src;
        }

        // img.onclick の設定は毎回やる
        img.onclick = () => openModal(img.src);
      });
    }
  });
}

function openModal(src) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");

  modalImg.src = src;
  modal.hidden = false;
}

// 背景クリックで閉じる
document.getElementById("modal").addEventListener("click", () => {
  document.getElementById("modal").hidden = true;
});
