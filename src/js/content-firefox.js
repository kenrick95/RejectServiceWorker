/**
 * コンテンツスクリプト処理
 */

(function() {
  let verify;
  const register = ServiceWorkerContainer.prototype.register.bind(navigator.serviceWorker);
  
  // サービスワーカー登録監視
  // サービスワーカー登録は、サービスワーカー登録鍵を待機する
  // サービスワーカー登録鍵あり時、登録する
  // サービスワーカー登録鍵なし時、登録拒否する
  const funcRegisterServiceWorker = function(scriptURL, options) {
    return new window.Promise((resolve, reject) => {
      var func = function() {
        if (verify) {
          if (verify == 'OK') {
            register(scriptURL, options).then(resolve, reject);
          } else {
            reject(new window.Error('Reject to register a ServiceWorker.'));
          }
        } else {
          window.setTimeout(func, 100);
        }
      };
      func();
    });
  };
  // サービスワーカー登録拒否（再度、上書きされる可能性あり）
  const funcRejectServiceWorker = function(scriptURL, options) {
    return new window.Promise((resolve, reject) => {
      //console.log('Reject to register a ServiceWorker.');
      reject(new window.Error('Reject to register a ServiceWorker.'));
    });
  };
  // サービスワーカー登録解除（失敗する可能性あり）
  const funcUnregisterServiceWorker = function() {
    try {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let i=0; i<registrations.length; i++) {
          registrations[i].unregister();
          //console.log('ServiceWorker unregister.');
        }
        if (registrations.length != 0) {
          caches.keys().then((keys) => {
            Promise.all(keys.map((key) => { return caches.delete(key); })).then(() => {
              //console.log('caches delete.');
            });
          });
        }
      });
    } catch (e) {}
  };
  // Note: #9 ページスクリプト内では、ページスクリプトのオブジェクトを使用する必要があります。
  //       window.Object でコンテンツスクリプトではなく、ページスクリプトのオブジェクトを使用できます。
  //       see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
  
  // サービスワーカー登録監視
  exportFunction(
      funcRegisterServiceWorker, 
      ServiceWorkerContainer.prototype, 
      {defineAs: 'register'});
  
  // サービスワーカー登録許可・拒否
  chrome.runtime.sendMessage({
    method: 'verify',
    hostname: location.hostname,
  }, (response) => {
    if (response.data) {
      // 許可
      verify = 'OK';
    } else {
      // 拒否
      verify = 'NG';
      exportFunction(
          funcRejectServiceWorker, 
          ServiceWorkerContainer.prototype, 
          {defineAs: 'register'});
      funcUnregisterServiceWorker();
    }
  });
})();

// 備考
// document_startタイミングでスクリプトを挿入することで、登録関数をバックアップされる前に上書きできる予定
// 登録鍵への総当り攻撃で登録をされる可能性がある。
// 登録解除は、確実に成功する保証はない。
