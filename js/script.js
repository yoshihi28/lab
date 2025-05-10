// タブ切り替え関数
function showTab(tabName) {
  // すべてのタブコンテンツを非表示にする
  document.querySelectorAll(".tab-content").forEach(section => {
    const isTarget = section.dataset.tab === tabName;
    section.hidden = !isTarget;

    // 画像が未読み込みの場合は読み込む
    if (isTarget) {
      section.querySelectorAll("img").forEach(img => {
        if (!img.src) {
          img.src = img.dataset.src;
        }

        // クリックでモーダル表示
        img.onclick = () => openModal(img.src);
      });
    }
  });
}

// モーダルを表示する関数
function openModal(src) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");

  modalImg.src = src;
  modal.classList.add("show");
}

// モーダルを閉じる
document.getElementById("modal").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
});

// 最初のタブを表示
showTab('food');
