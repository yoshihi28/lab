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
      // 画像
      element = document.createElement("img");
      element.src = item;
      element.alt = `${tabName} image`;
      element.loading = "lazy";
      element.addEventListener("click", () => openModal(item, 'image'));
      element.classList.add("media-item");
      tab.appendChild(element);
    } else if (typeof item === "object" && item.type === "video") {
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

      // クリックでモーダル開く
      wrapper.addEventListener("click", () => openModal(item.src, 'video'));

      wrapper.appendChild(video);
      wrapper.appendChild(playIcon);
      tab.appendChild(wrapper);
    }
  }

  loadedCounts[tabName] = end;
  updateScrollIndicator(); // インジケータ更新
}

// モーダル表示関数（画像または動画に対応）
function openModal(src, type = 'image') {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');

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

// モーダルを開く
const gallery = document.getElementById('gallery-container');
gallery.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'IMG') {
    openModal(target.src, 'image');
  } else if (target.tagName === 'VIDEO') {
    openModal(target.src, 'video');
  }
});

// モーダルを閉じる
document.getElementById('modal').addEventListener('click', (event) => {
  closeModal();
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
