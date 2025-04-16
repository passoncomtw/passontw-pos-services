/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

// 使用舊版 ReactDOM.render 方法
// @ts-ignore - 忽略 TypeScript 錯誤，因為我們知道這樣可以工作
ReactDOM.render(
  <App />,
  document.getElementById('app')
);

console.log('React 渲染已初始化'); 