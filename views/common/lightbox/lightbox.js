export default class Lightbox {
  constructor() {
    this.CLASSNAMES = {
      ACTIVATED: 'activated',
      REMOVE_TRANSITIONS: 'remove-transitions',
      LIGHTBOX: 'lightbox',
      LIGHTBOX_CONTENT: 'lightbox__content__body',
      LOCKSCROLL: 'scroll-locked',
      FOCUSTRAP: 'lightbox__focus-trap',
      LIGHTBOX_BG: 'lightbox__overlay',
      CLOSE_BTN: 'lightbox__close'
    };

    this.FOCUSABLE_ELEMENTS = 'a[href], area[href], input:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled]), iframe, object, ' +
      'embed, [tabindex="0"], [contenteditable], select:not([disabled])';

    this.isOpen = false;

    this._lightboxElem = document.getElementsByClassName(this.CLASSNAMES.LIGHTBOX)[0];
    this._focusTrap = this._lightboxElem.getElementsByClassName(this.CLASSNAMES.FOCUSTRAP)[0];

    this._closeBtn = this._lightboxElem.getElementsByClassName(this.CLASSNAMES.CLOSE_BTN)[0];
    this._bg = this._lightboxElem.getElementsByClassName(this.CLASSNAMES.LIGHTBOX_BG)[0];

    this._contentWrapper = this._lightboxElem.getElementsByClassName(this.CLASSNAMES.LIGHTBOX_CONTENT)[0];

    this._body = document.body;

    this.lastFocusElem = null;

    this.touchMoveEvent = null;

    // bind all lightbox clickable event
    this.bindDefaultEvents();
  }

  bindDefaultEvents() {
    this._bg.addEventListener('click', () => {
      this.close();
    }, false);

    this._closeBtn.addEventListener('click', () => {
      this.close();
    }, false);

    this._body.addEventListener('keydown', this._handleKeyPress.bind(this), false);
  }

  setContent(content) {
    this._contentWrapper.innerHTML = '';
    this._contentWrapper.appendChild(content);
  }

  open(content) {
    if (this.isOpen) {
      return;
    }

    if (content) {
      this.setContent(content);
    }

    this.isOpen = true;

    this.lastFocusElem = document.activeElement;

    this.focusableElems = this._lightboxElem.querySelectorAll(this.FOCUSABLE_ELEMENTS);

    this._focusTrap.focus();

    this._lockScroll();

    // Clear transition rules off the lightbox then activate after a short delay.
    // This helps to kick the new transition rules into place before the animation
    // runs. Otherwise we only see the correct animation the second time it's run.
    this._lightboxElem.classList.add(this.CLASSNAMES.REMOVE_TRANSITIONS);

    setTimeout(() => {
      this._lightboxElem.classList.remove(this.CLASSNAMES.REMOVE_TRANSITIONS);

      this._lightboxElem.classList.add(this.CLASSNAMES.ACTIVATED);
    }, 50);
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    // focus back the element before lightbox were opened
    this.lastFocusElem.focus();

    this.lastFocusElem = null;

    this.isOpen = false;

    this._unlockScroll();

    this._lightboxElem.classList.remove(this.CLASSNAMES.ACTIVATED);
  }

  _handleKeyPress(e) {
    // only handle it when it's opened
    if (!this.isOpen) {
      return;
    }

    // escape
    if (e.keyCode === 27) {
      this.close();
    } else if (e.keyCode === 9) {
      // handling tab key
      if (e.shiftKey) {
        if (document.activeElement === this.focusableElems[0]) {
          e.preventDefault();

          // Focusing on penultimate element and skipping the last,
          // as it is a focus trap
          this.focusableElems[this.focusableElems.length - 2].focus();
        }
      } else {
        if (document.activeElement === this.focusableElems[this.focusableElems.length - 1]) {
          event.preventDefault();
          this.focusableElems[0].focus();
        }
      }
    }
  }

  _preventTouchScroll(prevent) {
    if (prevent && !this.touchMoveEvent) {
      this.touchMoveEvent = this._preventDefault.bind(this);
      document.body.addEventListener('touchmove', this.touchMoveEvent, false);

      return;
    }

    if (!prevent && this.touchMoveEvent) {
      document.body.removeEventListener('touchmove', this.touchMoveEvent);
      this.touchMoveEvent = null;
    }
  }

  _preventDefault(e) {
    e.preventDefault();
  }

  _lockScroll() {
    this._body.classList.add(this.CLASSNAMES.LOCKSCROLL);
    this._preventTouchScroll(true);
  }

  _unlockScroll() {
    this._body.classList.remove(this.CLASSNAMES.LOCKSCROLL);
    this._preventTouchScroll();
  }
}