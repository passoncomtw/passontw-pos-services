import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    // 增加警告限制，避免非必要警告
    chunkSizeWarningLimit: 800,
    // 最佳化分割配置
    rollupOptions: {
      output: {
        // 手動分塊策略
        manualChunks: {
          // 將 React 相關庫打包成一個塊
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 將 Material UI 相關庫打包成一個塊
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
          // 將 Redux 相關庫打包成一個塊
          'vendor-redux': ['redux', 'react-redux', '@reduxjs/toolkit'],
        },
        // 分塊命名格式
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 減小構建大小
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true // 移除 debugger
      }
    },
    // 啟用 CSS 代碼分割
    cssCodeSplit: true,
    // 改進代碼加載方式和媒體查詢識別
    modulePreload: {
      polyfill: true
    }
  }
})
