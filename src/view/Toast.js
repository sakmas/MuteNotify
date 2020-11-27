const iziToast = require('izitoast');

class Toast {
  constructor() {
    iziToast.settings({
      title: 'マイクがミュート状態です',
      theme: 'dark',
      icon: 'fa fa-microphone-slash',
      close: false,
      timeout: false,
      position: 'center',
      displayMode: 1,
      layout: 2,
      maxWidth: '500px'
    });
  }
  show(options) {
    iziToast.show(options);
    this.toast = document.querySelector('.iziToast');
    this.isOpened = true;
  }
  hide() {
    if (this.isOpened) {
      iziToast.hide({}, this.toast);
      this.isOpened = false;
    }
  }
}

module.exports = new Toast();