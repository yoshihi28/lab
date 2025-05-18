let imagesPerLoad = window.innerWidth >= 768 ? 18 : 12;
const loadedTabs = {};
const loadedCounts = {};

function updateScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  const activeTab = document.querySelector('.tab-content:not([hidden])');
  if (!activeTab) {
    indicator.style.display = 'none';
    return;
  }

  const tabName = activeTab.getAttribute('data-tab');
  const hasMore = loadedCounts[tabName] < imageLists[tabName].length;

  // 高さ不足でスクロールできない時でも矢印出したい
  const canScroll = document.body.scrollHeight > window.innerHeight;
  const scrolledToBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 20);

  if (hasMore && (!scrolledToBottom || !canScroll)) {
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
}

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

    if (!loadedTabs[tabName]) {
      loadedTabs[tabName] = true;
      loadedCounts[tabName] = 0;
      loadMoreImages(tabName);
    }
  }

  // 対応するボタンに active クラスを追加
  const selectedButton = document.querySelector(`.tabs button[onclick="showTab('${tabName}')"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // 最後にインジケータ更新
  updateScrollIndicator();
}

// 指定タブに画像を追加で読み込む関数
function loadMoreImages(tabName) {
  const tab = document.getElementById(`${tabName}-tab`);
  const imageList = imageLists[tabName];
  if (!imageList) return;

  const start = loadedCounts[tabName];
  const end = Math.min(start + imagesPerLoad, imageList.length);

  for (let i = start; i < end; i++) {
    const img = document.createElement("img");
    img.src = imageList[i];
    img.alt = tabName + " image";
    img.loading = "lazy";
    img.addEventListener("click", () => openModal(imageList[i]));
    tab.appendChild(img);
  }
  loadedCounts[tabName] = end;

  // 最後にインジケータ更新
  updateScrollIndicator();
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

// スクロール監視して追加読み込みする処理
window.addEventListener('scroll', () => {
  console.log(`test`);

  // 今表示しているタブ
  const activeTab = document.querySelector('.tab-content:not([hidden])');
  if (!activeTab) return;
  const tabName = activeTab.getAttribute('data-tab');

  // 一番下まで来たか判定（20pxくらい手前で）
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 20)) {
    // まだ画像が残ってたら追加
    if (loadedCounts[tabName] < imageLists[tabName].length) {
      loadMoreImages(tabName);
    }
  }
});

// ページの読み込み完了後に実行
window.addEventListener('DOMContentLoaded', () => {
  showTab('tech');
});

// スクロール・タブ切り替え・画像追加のたびに呼ぶ
window.addEventListener('scroll', updateScrollIndicator);
window.addEventListener('resize', () => {
  imagesPerLoad = window.innerWidth >= 768 ? 18 : 12;
  updateScrollIndicator();
});
