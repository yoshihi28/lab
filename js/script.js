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
  modal.classList.add("show");
}

document.getElementById("modal").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
});
