import Lazyload from '../libs/lazyload';

import BackToTopButton from '../../../views/common/back-to-top/back-to-top';

class Home {
  constructor(config) {
    // initialise lazyload image
    this._lazyload = new Lazyload();
    this._lazyload.init();

    // initialise back to top button
    this._backToTopButton = new BackToTopButton();
    this._backToTopButton.init();

    this._lightboxButton = document.querySelector('.button__lightbox');

    this.bindLightboxEvent();
  }

  bindLightboxEvent() {
    this._lightboxButton.addEventListener('click', () => {
      const content = document.createElement('p');
      content.innerHTML = 'Lightbox content, I am';

      const lightboxEvent = new CustomEvent('open-lightbox', {
        bubbles: true,
        detail: {
          content
        }
      });

      this._lightboxButton.dispatchEvent(lightboxEvent);
    }, false);
  }
}

const home = new Home();