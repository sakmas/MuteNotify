const Store = require('electron-store');

class Settings {
  constructor() {
    this.store = new Store({ defaults: { 'deviceId': 'default' } });
  }
  setDeviceId(deviceId) {
    this.store.set('deviceId', deviceId);
  }
  getDeviceId(defaultValue) {
    return this.store.get('deviceId', defaultValue);
  }
}

module.exports = new Settings();