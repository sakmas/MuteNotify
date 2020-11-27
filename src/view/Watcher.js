const Toast = require('./Toast');

class Watcher {
  constructor() {
    this.timer = [];
  }
  async start(deviceId, deviceName) {
    this.stop();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: deviceId } });
    const interval = setInterval(() => {
      if (stream.getAudioTracks()[0].muted) {
        Toast.show({ message: deviceName });
      } else {
        Toast.hide();
      }
    }, 1000);
    this.timer.push(interval);
  }
  stop() {
    this.timer.forEach(timer => clearInterval(timer));
    Toast.hide();
  }
}

module.exports = new Watcher();