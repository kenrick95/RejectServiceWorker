/**
 * オプションページ処理
 */

(function () {
  // オプション画面の更新
  function onUpdateOptions(storage) {
    document.getElementById('storage_denylist').value =
      storage.denylist.join('\n');
    Object.keys(storage.checkbox).forEach(function (v) {
      const element = document.getElementById('storage_checkbox_' + v);
      if (element) {
        element.checked = storage.checkbox[v];
      }
    });
  }

  // ホワイトリストの更新
  function updateDenylist() {
    const text = document.getElementById('storage_denylist').value;
    chrome.runtime.sendMessage({
      method: 'setDenylist',
      data: text
        .split('\n')
        .map((v) => {
          return v.trim();
        })
        .filter((v) => {
          return v != '';
        }),
    });
  }

  let denylistTimer = null;
  function onUpdateDenylist() {
    clearTimeout(denylistTimer);
    denylistTimer = setTimeout(updateDenylist, 1000);
  }

  // チェックボックスの更新
  function onUpdateCheckbox() {
    const checkbox = {};
    Object.keys(defaultStorage.checkbox).forEach(function (v) {
      const element = document.getElementById('storage_checkbox_' + v);
      if (element) {
        checkbox[v] = element.checked;
      }
    });
    getStorage().set({ checkbox: checkbox });
  }

  // オプション画面の初期化
  function onInitialize() {
    getStorage().get(defaultStorage, function (storage) {
      onUpdateOptions(storage);
      document
        .getElementById('storage_denylist')
        .addEventListener('input', onUpdateDenylist);
      document
        .getElementById('storage_denylist')
        .addEventListener('blur', updateDenylist);
      Object.keys(storage.checkbox).forEach(function (v) {
        const element = document.getElementById('storage_checkbox_' + v);
        if (element) {
          element.addEventListener('click', onUpdateCheckbox);
        }
      });
    });
  }

  // メッセージイベント
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    switch (request.method) {
      case 'updateOptions':
        onUpdateOptions(request.data);
        break;
    }
  });

  document.addEventListener('DOMContentLoaded', onInitialize);
})();
