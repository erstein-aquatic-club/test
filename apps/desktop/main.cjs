const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    window.loadURL(devUrl);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(process.resourcesPath, 'app', 'index.html');
    window.loadFile(indexPath);
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
