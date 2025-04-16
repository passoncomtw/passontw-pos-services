import React, { useState, useEffect } from 'react';
import '../index.css';

// 應用程式組件
const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 模擬資料載入
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // 應用淡入效果
      const container = document.querySelector('.container');
      if (container) {
        container.classList.add('fade-in');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 處理主題切換
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // 更新 body 類別以應用主題變數
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // 儲存使用者偏好設定
    localStorage.setItem('theme', newTheme);
  };

  // 初始化主題設定
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      }
    } else {
      // 使用系統偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.body.classList.add('dark-theme');
      }
    }
  }, []);

  // 載入中狀態
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>載入應用程式中...</p>
      </div>
    );
  }

  return (
    <div className={`container fade-in ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>商家管理系統</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? '切換至深色模式' : '切換至淺色模式'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main>
        <section className="welcome-section">
          <h2>歡迎使用商家管理系統</h2>
          <p>
            這是一個功能強大的商家管理平台，專為商家提供訂單管理、庫存追蹤、銷售分析等功能。
            透過簡潔直觀的介面，讓您輕鬆管理業務，提升營運效率。
          </p>
        </section>

        <section className="counter-section">
          <h2>功能展示 - 計數器</h2>
          <p>這是一個簡單的計數器元件，展示了應用程式的基本互動功能。</p>
          <div className="counter">
            <button 
              onClick={() => setCount(prev => Math.max(0, prev - 1))}
              disabled={count === 0}
              aria-label="減少計數"
            >
              -
            </button>
            <span>{count}</span>
            <button 
              onClick={() => setCount(prev => prev + 1)}
              aria-label="增加計數"
            >
              +
            </button>
          </div>
          <p className="counter-description">
            {count === 0 
              ? '點擊加號按鈕開始計數'
              : `當前計數: ${count}${count >= 10 ? ' - 做得好！' : ''}`}
          </p>
        </section>

        <section>
          <h2>技術棧</h2>
          <p>本應用程式使用以下現代技術開發:</p>
          <div className="tech-stack">
            <div className="tech-item">
              <h3>React</h3>
              <p>用於構建用戶界面的 JavaScript 庫</p>
            </div>
            <div className="tech-item">
              <h3>TypeScript</h3>
              <p>添加靜態類型的 JavaScript 超集</p>
            </div>
            <div className="tech-item">
              <h3>Electron</h3>
              <p>使用 Web 技術構建跨平台桌面應用程式</p>
            </div>
            <div className="tech-item">
              <h3>Modern CSS</h3>
              <p>使用 CSS 變數和 Flexbox/Grid 實現響應式設計</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="version-info">
          <p>商家管理系統 v1.0.0</p>
          <p>&copy; 2023 商家系統開發團隊。保留所有權利。</p>
        </div>
      </footer>
    </div>
  );
};

export default App; 