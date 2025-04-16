/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 使用 React 18 的 createRoot API
const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);

console.log('React 渲染已初始化'); 