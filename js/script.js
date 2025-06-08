let imagesPerLoad = window.innerWidth >= 768 ? 18 : 12;
const loadedTabs = {};
const loadedCounts = {};
let currentMediaIndex = null;
let currentTabName = null;

function updateScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  const activeTab = document.querySelector('.tab-content:not([hidden])');
  if (!activeTab) {
    indicator.style.display = 'none';
    return;
  }

  const tabName = activeTab.getAttribute('data-tab');
  const hasMore = loadedCounts[tabName] < mediaLists[tabName].length;

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
      loadMoreMedia(tabName);
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

// 指定タブに画像・動画を追加で読み込む関数
function loadMoreMedia(tabName) {
  const tab = document.getElementById(`${tabName}-tab`);
  const mediaList = mediaLists[tabName];
  if (!mediaList) return;

  const start = loadedCounts[tabName] || 0;
  const end = Math.min(start + imagesPerLoad, mediaList.length);

  for (let i = start; i < end; i++) {
    const item = mediaList[i];
    let element;

    if (typeof item === "string") {
      // 画像（文字列の場合）
      element = document.createElement("img");
      element.src = item;
      element.alt = `${tabName} image`;
      element.loading = "lazy";
      element.addEventListener("click", () => openModal(item.src || item, 'image', item.description, i, tabName));
      element.classList.add("media-item");
      element.dataset.index = i;
      element.dataset.tab = tabName;
      tab.appendChild(element);
    } else if (typeof item === "object") {
      if (item.type === "video") {
        // 動画のラッパーを作る
        const wrapper = document.createElement("div");
        wrapper.classList.add("video-wrapper", "media-item");

        const video = document.createElement("video");
        video.src = item.src;
        video.controls = false;
        video.preload = "none";
        video.setAttribute("poster", item.poster || "");
        video.classList.add("video-item");

        // 再生マーク要素
        const playIcon = document.createElement("div");
        playIcon.classList.add("play-icon");
        playIcon.innerHTML = "&#9658;"; // ▶の三角形

        // クリックでモーダル開く（説明文も渡す）
        wrapper.addEventListener("click", () => openModal(item.src, 'video', item.description, i, tabName));

        wrapper.appendChild(video);
        wrapper.appendChild(playIcon);
        wrapper.dataset.index = i;
        wrapper.dataset.tab = tabName;
        tab.appendChild(wrapper);
      } else {
        // 画像（オブジェクトの場合 - 説明文付き）
        element = document.createElement("img");
        element.src = item.src || item;
        element.alt = `${tabName} image`;
        element.loading = "lazy";
        element.addEventListener("click", () => openModal(item.src || item, 'image', item.description, i, tabName));
        element.classList.add("media-item");
        element.dataset.index = i;
        element.dataset.tab = tabName;
        tab.appendChild(element);
      }
    }
  }

  loadedCounts[tabName] = end;
  updateScrollIndicator(); // インジケータ更新
}

// モーダル表示関数（画像または動画に対応、説明文も表示）
function openModal(src, type = 'image', description = null, index = null, tabName = null) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');
  const modalDescription = document.getElementById('modal-description');

  // どのタブの何番目かを記録
  currentMediaIndex = index;
  currentTabName = tabName;

  // デバッグ用のログを追加
  console.log('Description value:', description);
  console.log('Description element:', modalDescription);
  console.log('Description type:', typeof description);

  // 説明文を更新
  if (description) {
    modalDescription.textContent = description;
    modalDescription.style.display = 'block';
     console.log('Description should be visible now');
  } else {
    modalDescription.style.display = 'none';
     console.log('Description hidden because no description provided');
  }

  if (type === 'image') {
    modalImg.src = src;
    modalImg.style.display = 'block';
    modalVideo.style.display = 'none';
    modalVideo.pause(); // 動画再生停止
  } else if (type === 'video') {
    modalVideo.src = src;
    modalVideo.style.display = 'block';
    modalImg.style.display = 'none';

    modalVideo.muted = true;       // ミュートにする
    modalVideo.autoplay = true;    // 自動再生ON
    modalVideo.playsInline = true; // iOSでインライン再生
    modalVideo.load();             // 動画をロード
    modalVideo.play().catch(() => {
      // 自動再生できない場合の処理（ユーザー操作待ち）
    });
  }

  modal.classList.add("show");
}

// モーダル閉じる関数
function closeModal() {
  const modal = document.getElementById('modal');
  const modalVideo = document.getElementById('modal-video');
  modal.classList.remove("show");
  modalVideo.pause(); // 閉じたら動画も止める
}

// 前後に移動する関数
function showAdjacentMedia(direction) {
  if (!currentTabName || currentMediaIndex === -1) return;

  const mediaList = mediaLists[currentTabName];
  let newIndex = currentMediaIndex + direction;

  if (newIndex < 0 || newIndex >= mediaList.length) return;

  const newMedia = mediaList[newIndex];
  const type = (typeof newMedia === 'object' && newMedia.type === 'video') ? 'video' : 'image';
  const src = typeof newMedia === 'string' ? newMedia : newMedia.src;
  const description = typeof newMedia === 'object' ? newMedia.description || null : null;

  openModal(src, type, description, newIndex, currentTabName);

  currentMediaIndex = newIndex;
}

// モーダルを閉じる
document.getElementById('modal').addEventListener('click', (event) => {
  closeModal();
});

// 前後移動
document.getElementById('modal-prev').addEventListener('click', (e) => {
  e.stopPropagation(); // モーダル自体のクリック判定を止める
  showAdjacentMedia(-1);
});

document.getElementById('modal-next').addEventListener('click', (e) => {
  e.stopPropagation();
  showAdjacentMedia(1);
});

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('modal').classList.contains('show')) return;
  if (e.key === 'ArrowLeft') showAdjacentMedia(-1);
  if (e.key === 'ArrowRight') showAdjacentMedia(1);
});

// スクロール監視して追加読み込みする処理
window.addEventListener('scroll', () => {
  // 今表示しているタブ
  const activeTab = document.querySelector('.tab-content:not([hidden])');
  if (!activeTab) return;

  const tabName = activeTab.getAttribute('data-tab');
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageBottom = document.body.offsetHeight;

  if ((scrollBottom + 50) >= pageBottom) {
    if (loadedCounts[tabName] < mediaLists[tabName].length) {
      loadMoreMedia(tabName);
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