export default class BackToTopButton {
  constructor(config = {}) {
    this.config = {
      bodyElem: document.querySelector('main'),
      offset: '-150%'
    };

    this.config = {
      ...this.config,
      ...config
    };

    this._backToTopBtn = document.querySelector('.back-to-top');
  }

  init() {
    const waypoint = new Waypoint({
      element: this.config.bodyElem,
      handler: (direction) => {
        this._showHideBackToTopButton(direction);
      },
      offset: this.config.offset
    });

    this._backToTopBtn.addEventListener('click', this._scrollToTop.bind(this), false);
  }

  _scrollToTop() {
    window.scroll({
      top: this.config.bodyElem.offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }

  _showHideBackToTopButton(direction) {
    if (direction === 'down') {
      this._backToTopBtn.removeAttribute('aria-hidden');
    } else {
      this._backToTopBtn.setAttribute('aria-hidden', 'true');
    }
  }
}