/**
 * バックグラウンド処理
 */

(function () {
  var cacheStorage = defaultStorage;
  var denySet = new Set(cacheStorage.denylist);

  // オプション画面の更新通知
  function sendUpdateOptions() {
    getStorage().set({ denylist: cacheStorage.denylist }, () => {});
    chrome.runtime.sendMessage({
      method: 'updateOptions', // options.js
      data: cacheStorage,
    });
  }

  // ストレージ読み出し
  getStorage().get(defaultStorage, function (storage) {
    cacheStorage = storage;
    denySet = new Set(cacheStorage.denylist);
  });

  // メッセージイベント
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    switch (request.method) {
      case 'register': // content.js
        // アイコン変更
        // 登録通知
        break;
      case 'verify': // content.js
        // 登録解除を判定
        sendResponse({
          data: denySet.has(request.hostname),
        });
        break;
      case 'popup': // popup.js
        sendResponse({ data: !denySet.has(request.hostname) });
        break;
      case 'setDenylist': // options.js
        cacheStorage.denylist = request.data;
        denySet = new Set(cacheStorage.denylist);
        sendUpdateOptions();
        break;
      case 'addDenylist': // popup.js
        if (!denySet.has(request.hostname)) {
          cacheStorage.denylist.push(request.hostname);
          denySet.add(request.hostname);
          sendUpdateOptions();
        }
        break;
      case 'removeDenylist': // popup.js
        if (denySet.has(request.hostname)) {
          cacheStorage.denylist = cacheStorage.denylist.filter((v) => {
            return v != request.hostname;
          });
          denySet.delete(request.hostname);
          sendUpdateOptions();
        }
        break;
    }
  });

  // ブラウザアクションの更新
  updateBrowserAction();
})();
