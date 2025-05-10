// タブ切り替え関数
function showTab(tabName) {
  // すべてのタブを非表示にする
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => {
    tab.hidden = true;
  });

  // 対応するタブを表示する
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.hidden = false;
  }
}

// モーダル表示関数
function openModal(imageSrc) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  modal.style.display = 'block';
  modalImg.src = imageSrc;
}

// モーダル閉じる関数
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// モーダルをクリックで閉じる
document.getElementById('modal').addEventListener('click', closeModal);

// 初期状態で「food」タブを表示
showTab('food');