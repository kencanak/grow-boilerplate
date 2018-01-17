export default class Lazyload {
  constructor() {
    this.CLASSNAMES = {
      LAZY_IMAGE: 'lazy-image',
      LOADED: 'lazy-image__loaded'
    };

    this._lazyImages = document.getElementsByClassName(this.CLASSNAMES.LAZY_IMAGE);
  }

  init() {
    this._lazyImages.forEach((image) => {
      const waypoint = new Waypoint({
        element: image,
        handler: () => {
          this.loadActualImage(waypoint, image);
        },
        offset: '120%'
      });
    });
  }

  loadActualImage(waypoint, image) {
    if (image.tagName === 'IMG') {
      image.addEventListener('load', () => {
        image.classList.add(this.CLASSNAMES.LOADED);
      }, false);
    }

    if (image.getAttribute('data-src')) {
      image.setAttribute('src', image.getAttribute('data-src'));
    }

    if (image.getAttribute('data-srcset')) {
      image.setAttribute('srcset', image.getAttribute('data-srcset'));
    }

    waypoint.destroy();
  }
}