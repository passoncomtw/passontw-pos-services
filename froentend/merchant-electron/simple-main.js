const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  // 創建瀏覽器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // 加載 HTML 文件
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  
  // 打開開發者工具
  mainWindow.webContents.openDevTools();
  
  console.log('應用程式已啟動');
});
