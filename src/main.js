const { app, ipcMain, Menu, Tray, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const Settings = require('./view/Settings');

let win;
const createWindow = () => {
  const windowState = windowStateKeeper();
  win = new BrowserWindow({
    height: 125,
    width: 550,
    x: windowState.x,
    y: windowState.y,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    resizable: true,
    skipTaskbar: true,
    show: false,
    fullscreenable: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(`${__dirname}/view/index.html`);
  // win.webContents.openDevTools();
  windowState.manage(win);

  win.once('ready-to-show', () => win.show());
};

const addIpcEventListener = () => {
  ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
    win.setIgnoreMouseEvents(...args);
  });
};

let tray;
const createTrayIcon = () => {
  tray = new Tray(`${__dirname}/../assets/win/icon.ico`);
  tray.setToolTip('MuteNotify');
};

const createMenu = (deviceList, targetDevice = {}) => {
  const deviceMenu = deviceList.map(device => {
    return {
      type: 'radio',
      label: device.label,
      deviceId: device.deviceId,
      click: item => {
        Settings.setDeviceId(item.deviceId);
        win.webContents.send('start-check', item.deviceId, item.label);
      },
      checked: device.deviceId === targetDevice.deviceId
    };
  });
  deviceMenu.unshift({
    type: 'radio',
    label: '一時停止',
    deviceId: '',
    click: item => win.webContents.send('stop-check'),
    checked: !targetDevice.deviceId
  });
  const contextMenu = Menu.buildFromTemplate([
    ...deviceMenu,
    { type: 'separator' },
    {
      label: '設定', submenu: [{
        label: '表示位置調整',
        click: () => win.webContents.send('settings-move')
      }]
    },
    { type: 'separator' },
    { label: '終了', type: 'normal', role: 'quit' },
  ]);
  tray.setContextMenu(contextMenu);
};

ipcMain.on('menu-devices-update', (event, deviceList, ...args) => {
  const storedDeviceId = Settings.getDeviceId();
  const targetDevice = deviceList.find(device => device.deviceId === storedDeviceId);
  createMenu(deviceList, targetDevice);
  if (targetDevice) {
    win.webContents.send('start-check', targetDevice.deviceId, targetDevice.label);
  }
});

app.whenReady().then(() => {
  createWindow();
  addIpcEventListener();
  createTrayIcon();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});