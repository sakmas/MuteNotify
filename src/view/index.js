const { ipcRenderer } = require('electron');
const Watcher = require('./Watcher');

const getDeviceList = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter(device => device.kind === 'audioinput')
    .filter(device => device.deviceId !== 'default')
    .filter(device => device.deviceId !== 'communications')
};

navigator.mediaDevices.ondevicechange = async event => {
  const devices = (await getDeviceList()).map(device => {
    return { deviceId: device.deviceId, label: device.label };
  });
  ipcRenderer.send('menu-devices-update', devices);
};

ipcRenderer.on('start-check', (_, deviceId, deviceName) => {
  Watcher.start(deviceId, deviceName);
});

ipcRenderer.on('stop-check', () => {
  Watcher.stop();
});

// settings
// move position
const dragOverlay = document.querySelector('#drag-overlay');

ipcRenderer.on('settings-move', () => {
  ipcRenderer.send('set-ignore-mouse-events', false);
  dragOverlay.style.display = 'flex';
});

document.querySelector('#drag-overlay-apply').addEventListener('click', () => {
  dragOverlay.style.display = 'none';
  ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
});