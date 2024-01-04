# Deny Service Workers

Deny ServiceWorker only for sites listed in denylist.

## Features

This extension will reject registration of service workers for sites listed in the denylist. Service workers who have already registered before the extension was introduced will be unregistered when they visit your site for the first time after the extension was introduced.

## License

[MIT](https://github.com/k08045kk/RejectServiceWorker/blob/master/LICENSE)

## Author

Forked from [RejectServiceWorker](https://github.com/k08045kk/RejectServiceWorker), originally by [toshi](https://github.com/k08045kk).

## Idea

- Rewrite in Manifest v3
- content script inject scripts --> replace navigator.serviceWorker with a proxy
  - on trigger, post message to extension service worker to check if current hostname is in denylist
- background (service worker) handle
- options_ui: options page, save/update denylist
    - on change, update storage
    - support subdomains matching? (1st ver: exact)
