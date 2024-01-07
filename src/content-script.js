console.log('!!dsw!! cs');


function injectedScript() {
  try {
    const swRegisterProxy = new Proxy(navigator.serviceWorker.register, {
      apply: function (target, thisArg, args) {
        console.log('!!dsw!! proxy register', args);
        return new Promise(async (resolve, reject) => {
          console.log('!!dsw!! proxy register promise');

          // TODO: ask background-script whether or not to allow
          if (Math.random() > 0.5) {
            console.log('!!dsw!! proxy register promise original');
            try {
              const result = target.apply(thisArg, args);
              console.log('!!dsw!! proxy register promise original resolve');
              resolve(result);
            } catch (e) {
              console.log('!!dsw!! proxy register promise original reject');
              reject(e);
            }
          } else {
            console.log('!!dsw!! proxy register promise reject');
            reject(
              Error(`Service Worker registration denied by extension. !!dsw!!`)
            );
          }
        });
      },
    });
    navigator.serviceWorker.register = swRegisterProxy;
    console.log('!!dsw!! cs injected');
  } catch (e) {
    console.log('!!dsw!! err', e);
  }
}

function injectScript(text) {
  const script = document.createElement('script');
  script.textContent = `(${text})();`;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}
injectScript(injectedScript.toString());
