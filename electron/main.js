const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 880,
    icon: path.join(process.env.PUBLIC, "icon.ico"),
    //frame: false,   	//让桌面应用没有边框，这样菜单栏也会消失
    //  icon: iconPath,     //应用运行时的标题栏图标
    //  minWidth: 300,     // 最小宽度
    //  minHeight: 500,    // 最小高度
    //  maxWidth: 300,    // 最大宽度
    //  maxHeight: 600,    // 最大高度
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // 设置应用程序的菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.setTitle('逗地主');
  mainWindow.on('closed', () => mainWindow = null);
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    // 在这里打开开发者控制台
    mainWindow.webContents.openDevTools();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});