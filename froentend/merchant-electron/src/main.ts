import { app, BrowserWindow, session } from 'electron';
import path from 'node:path';
import url from 'url';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 禁用控制台的特定警告訊息
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
// 禁用 Autofill 警告
app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');

// 顯示詳細錯誤訊息
process.on('uncaughtException', (error) => {
  console.error('未捕獲的錯誤：', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未處理的 Promise 拒絕：', reason);
});

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDevelopment = process.env.NODE_ENV !== 'production';

const createWindow = (): void => {
  console.log('創建視窗...');
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // 在完成載入前不顯示視窗
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // 在開發環境中啟用 Node 整合以便調試，生產環境中禁用以增強安全性
      nodeIntegration: isDevelopment, 
      // 開發環境禁用上下文隔離以便調試，生產環境中啟用
      contextIsolation: !isDevelopment,
      // 開發環境中禁用沙箱，生產環境中啟用
      sandbox: !isDevelopment,
    },
  });

  // 設定內容安全策略 (CSP)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          isDevelopment 
            // 開發模式下的寬鬆策略
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' localhost:*;"
            // 生產模式下的嚴格策略
            : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
        ],
      },
    });
  });

  // 監聽載入錯誤
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`載入失敗：${errorCode} - ${errorDescription}`);
    
    // 載入失敗時使用靜態 HTML 作為備用
    const fallbackPath = path.join(__dirname, 'index.html');
    mainWindow.loadFile(fallbackPath);
  });

  // 監聽載入狀態
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('開始載入...');
  });

  mainWindow.webContents.on('did-stop-loading', () => {
    console.log('停止載入...');
  });

  try {
    console.log('嘗試載入 Webpack 入口點:', MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  } catch (err) {
    console.error('載入 URL 時發生錯誤:', err);
    
    // 嘗試使用靜態 HTML 作為備用
    const fallbackPath = path.join(__dirname, 'index.html');
    console.log('使用靜態 HTML 作為備用:', fallbackPath);
    mainWindow.loadFile(fallbackPath);
  }

  // 設定啟動畫面
  mainWindow.once('ready-to-show', () => {
    console.log('視窗準備好顯示');
    mainWindow.show();
  });

  // 只在開發環境中開啟開發者工具
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
    console.log('已開啟開發者工具');
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log(`應用程式啟動中... 環境: ${process.env.NODE_ENV || 'development'}`);
  createWindow();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch(err => {
  console.error('應用程式啟動失敗:', err);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 