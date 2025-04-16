// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// 暴露必要的 API 給渲染進程
contextBridge.exposeInMainWorld('electron', {
  // 可以添加 IPC 調用方法
  ping: () => ipcRenderer.invoke('ping'),
  // 其他方法
});

// 使用控制台輸出標記 preload 腳本已執行
console.log('Preload 腳本已載入');

// 添加全局變數，協助與主進程通信
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 已完全載入，準備初始化 React');
}); 