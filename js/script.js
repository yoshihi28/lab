// 読み込んだタブを記録するオブジェクト
const loadedTabs = {};

// タブ切り替え関数
function showTab(tabName) {
  // すべてのタブを非表示にする
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => {
    tab.hidden = true;
  });

  // タブボタンから active クラスを削除
  const allButtons = document.querySelectorAll('.tabs button');
  allButtons.forEach(button => {
    button.classList.remove('active');
  });

  // 対応するタブを表示する
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.hidden = false;

    // まだ画像を追加してない場合だけ追加する
    if (!loadedTabs[tabName]) {
      addImagesToTab(`${tabName}-tab`, imageLists[tabName], tabName); // imageLists はタブ名ごとの画像リストを持ったオブジェクト
      loadedTabs[tabName] = true; // 一度追加したらフラグを立てるニャ
    }
  }

  // 対応するボタンに active クラスを追加
  const selectedButton = document.querySelector(`.tabs button[onclick="showTab('${tabName}')"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }
}

// モーダル表示関数
function openModal(imageSrc) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  modal.classList.add("show");
  modalImg.src = imageSrc;
}

// モーダル閉じる関数
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove("show");
}

// 画像クリック時にモーダルを開くイベントを追加
document.querySelectorAll('#gallery-container img').forEach(img => {
  img.addEventListener('click', () => {
    openModal(img.src);
  });
});

// モーダルをクリックで閉じる（背景部分）
document.getElementById('modal').addEventListener('click', (event) => {
  closeModal();
});

// 画像をタブに追加
function addImagesToTab(tabId, imageList, altText = "Image") {
  const tab = document.getElementById(tabId);
  imageList.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = altText;
    img.loading = "lazy";
    img.addEventListener("click", () => openModal(src));
    tab.appendChild(img);
  });
}

// ページの読み込み完了後に実行
window.addEventListener('DOMContentLoaded', () => {
  showTab('tech');
});
