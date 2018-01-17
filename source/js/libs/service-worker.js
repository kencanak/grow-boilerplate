import SWToast from '../../../views/common/sw-toast/sw-toast';

export default class ServiceWorker {
  constructor() {
    this._swToast = new SWToast();

    this.CLASSNAMES = {
      PAGE_OFFLINE: 'page--offline'
    };
  }

  init() {
    if ('serviceWorker' in navigator) {
      /**
       * Disabled until browser support has matured
       *
       */

      const swPath = '/service-worker.js';

      navigator.serviceWorker.register(swPath).then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;

          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  this._swToast.showMessage(
                    this._swToast.MESSAGE_TYPE.SW_UPDATED_CONTENT
                  );
                } else {
                  this._swToast.showMessage(
                    this._swToast.MESSAGE_TYPE.SW_INSTALLED
                  );
                }
                break;
              case 'redundant':
                console.log('redundant');
                break;
            }
          };
        };
      }).catch(error => {
        console.log('error: ', error);
      });

      // bind online event
      this.bindOnlineEvent();

      if ('onLine' in navigator && !navigator.onLine) {
        this._swToast.showMessage(this._swToast.MESSAGE_TYPE.OFFLINE);
        this.toggleBodyOnlineClass(false);
      }
    }
  }

  bindOnlineEvent() {
    window.addEventListener('online',  (e) => {
      this.updateOnlineStatus(e);
    });

    window.addEventListener('offline', (e) => {
      this.updateOnlineStatus(e);
    });
  }

  toggleBodyOnlineClass(online) {
    document.body.classList.toggle(this.CLASSNAMES.PAGE_OFFLINE, !online);
  }

  updateOnlineStatus(e) {
    this._swToast.showMessage(navigator.onLine ?
      this._swToast.MESSAGE_TYPE.ONLINE : this._swToast.MESSAGE_TYPE.OFFLINE);

    this.toggleBodyOnlineClass(navigator.onLine);
  }
}