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
  if (event.target === event.currentTarget) {  // 背景部分だけをクリックした場合
    closeModal();
  }
});

// 閉じるボタンのイベントリスナーを追加
document.getElementById('close-btn').addEventListener('click', closeModal);

// ページの読み込み完了後に実行
window.addEventListener('DOMContentLoaded', () => {
  showTab('food');
});
