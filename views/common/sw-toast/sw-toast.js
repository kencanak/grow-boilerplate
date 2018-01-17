export default class SWToast {
  constructor() {
    this.CLASSNAMES = {
      TOAST: 'sw-toast',
      TOAST_VISIBLE: 'sw-toast--visible',
      TOAST_MESSAGE: 'sw-toast__message',
      TOAST_MESSAGE_VISIBLE: 'sw-toast__message--visible',
      TOAST_RELOAD_BUTTON: 'sw-toast__message__reload'
    };

    this.MESSAGE_TYPE = {
      SW_INSTALLED: 'installed',
      SW_UPDATED_CONTENT: 'updated',
      OFFLINE: 'offline',
      ONLINE: 'online'
    };

    this._toastElem = document.getElementsByClassName(this.CLASSNAMES.TOAST)[0];

    this.timerIntervalDuration = 0;
    this.timerInterval = null;

    // Parse the toast's animation delay and duration, and use it as the
    // timer interval.
    const animDuration = parseFloat(
      window.getComputedStyle(this._toastElem, null).getPropertyValue('animationDuration')
    );

    const animDelay = parseFloat(
      window.getComputedStyle(this._toastElem, null).getPropertyValue('animationDelay')
    );

    if (!isNaN(animDuration)) {
      this.timerIntervalDuration += animDuration * 1000;
    }
    if (!isNaN(animDelay)) {
      this.timerIntervalDuration += animDelay * 1000;
    }

    // bind reload button
    this._bindReloadButton();
  }

  _bindReloadButton() {
    const reloadButtons = this._toastElem.getElementsByClassName(this.CLASSNAMES.TOAST_RELOAD_BUTTON);

    reloadButtons.forEach((reloadButton) => {
      reloadButton.addEventListener('click', (e) => {
        this._reloadPage(e);
      }, false);
    });
  }

  showMessage(type) {
    const message = this._toastElem.querySelector(`.${this.CLASSNAMES.TOAST_MESSAGE}--${type}`);

    const allCurrentVisibleMessage = this._toastElem.getElementsByClassName(this.CLASSNAMES.TOAST_MESSAGE_VISIBLE);

    allCurrentVisibleMessage.forEach((visibleMsg) => {
      visibleMsg.classList.remove(this.CLASSNAMES.TOAST_MESSAGE_VISIBLE);
    });

    message.classList.add(this.CLASSNAMES.TOAST_MESSAGE_VISIBLE);

    this.showToast();
  }

  showToast() {
    // If the timer was already running, reset the toast.
    if (this.timerInterval) {
      this.hideToast();
    }

    requestAnimationFrame(function() {
      this.timerInterval = setTimeout(() => {
        this.hideToast();
      }, this.timerIntervalDuration);

      // Wait another frame, so that the animation get correctly reset.
      // Then show the toast.
      requestAnimationFrame(function() {
        this._toastElem.classList.add(this.CLASSNAMES.TOAST_VISIBLE);
      }.bind(this));
    }.bind(this));
  }

  hideToast() {
    if (this.timerInterval) {
      clearTimeout(this.timerInterval);
      this.timerInterval = null;
    }

    this._toastElem.classList.remove(this.CLASSNAMES.TOAST_VISIBLE);
  }

  _reloadPage(e) {
    e.preventDefault();

    window.location.reload(true);
  }
}