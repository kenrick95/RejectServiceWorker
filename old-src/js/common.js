// ストレージの初期値
var defaultStorage = {
  version: 1,
  denylist: [],
  checkbox: {
    notificationPopup: false,
    notificationIcon: false,
  },
};

// ストレージの取得
function getStorage() {
  //return (chrome.storage.sync ? chrome.storage.sync : chrome.storage.local);
  return chrome.storage.local;
}

// ブラウザアクションの更新
function updateBrowserAction() {
  chrome.browserAction.setPopup({ popup: '/html/popup.html' });
}
