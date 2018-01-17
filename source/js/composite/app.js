import ServiceWorker from '../libs/service-worker';

import Lightbox from '../../../views/common/lightbox/lightbox';
import GATrack from '../libs/ga-track';

class App {
  constructor() {
    this._serviceWorker = new ServiceWorker();
    this._serviceWorker.init();

    this._lightbox = new Lightbox();

    this.listenToLightboxEvent();

    if (document.body.className.indexOf('ga-track-enabled') > -1) {
      window.addEventListener('load', () => {
        // initialise GA track
        this._gaTrack = new GATrack();
        this._gaTrack.init();
      }, false);
    }
  }

  listenToLightboxEvent() {
    window.addEventListener('open-lightbox', (e) => {
      this._lightbox.open(e.detail ? e.detail.content : null);
    });

    window.addEventListener('close-lightbox', () => {
      this._lightbox.close();
    });
  }
}

const app = new App();