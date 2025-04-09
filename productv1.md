# POS系統產品規格書

## 目錄
1. [專案概述](#專案概述)
2. [系統需求](#系統需求)
   - [後台功能](#後台功能)
   - [店家前端功能](#店家前端功能)
3. [技術架構](#技術架構)
   - [系統架構圖](#系統架構圖)
   - [後端技術](#後端技術)
   - [前端技術](#前端技術)
   - [資料庫設計](#資料庫設計)
   - [消息隊列](#消息隊列)
   - [緩存策略](#緩存策略)
4. [硬體需求](#硬體需求)
5. [開發與部署流程](#開發與部署流程)
6. [UI設計規範](#ui設計規範)
   - [色彩方案](#色彩方案)
   - [風格指南](#風格指南)
7. [擴展性考量](#擴展性考量)
8. [第一階段實施計劃](#第一階段實施計劃)

## 專案概述

本專案旨在開發一套針對餐飲業的POS（銷售點）系統，第一階段專注於單一店家的基礎功能實現，同時在架構設計上預留多店家擴展彈性。系統分為後台管理界面和店家前端操作界面，提供菜單管理、訂單處理和出單功能，以提升餐飲業經營效率。

**參考產品**：Maifood (https://www.maifood.com.tw/)

## 系統需求

### 後台功能

1. **系統架構**
   - 設計多租戶(Multi-tenant)資料庫架構
   - 店家層級的資料隔離
   - 統一的管理後台入口

2. **店家管理**
   - 建立單一店家帳戶與設定
   - 預留店家模板與複製功能
   - 店家基本資訊設定（名稱、地址、聯絡資訊）

3. **菜單管理**
   - 新增/編輯/刪除菜品
   - 設定菜品分類（主食、飲料、小吃等）
   - 菜品價格與圖片設定
   - 設定菜品選項（大小份、辣度、配料等）
   - 預留菜單模板功能

4. **使用者管理**
   - 員工帳號與權限設定（預留跨店權限設計）
   - 班次管理

5. **訂單管理**
   - 店家層級的訂單記錄
   - 訂單狀態追蹤（已完成、已取消）
   - 訂單明細查詢與搜尋
   - 重新列印收據

### 店家前端功能

1. **點餐界面**
   - 分類瀏覽菜品
   - 菜品選項與客製化設定
   - 熱門菜品快捷按鈕
   - 加入/修改/移除菜品

2. **訂單處理**
   - 內用/外帶分類
   - 簡易桌位管理
   - 多訂單並行處理
   - 暫存訂單功能

3. **結帳功能**
   - 現金結帳
   - 顯示應收金額和找零計算
   - 完成訂單確認

4. **出單功能**
   - 透過 CP-Q3X 感熱式出單機列印收據
   - 廚房出單與客人收據分離
   - 收據格式設定（預留店家品牌化選項）

## 技術架構

### 系統架構圖

![POS系統完整服務架構圖](pos-system-architecture.svg)

**圖例說明**:
- **客戶端層**: 店家前端操作介面、後台管理介面、安卓平板設備
- **API閘道層**: 處理HTTP請求、實現SSL加密
- **後端服務層**: Golang實現的微服務群
- **數據存儲層**: PostgreSQL主數據庫、Redis緩存
- **消息隊列層**: NATS事件驅動與異步處理
- **硬體設備層**: 出單機、錢箱等硬體設備
- **監控與日誌層**: Prometheus監控、ELK/Loki日誌收集

### 後端技術

1. **技術棧**
   - **語言**: Golang
   - **框架**: Echo/Gin
   - **架構**: 乾淨架構(Clean Architecture)

2. **API服務**
   - RESTful API設計
   - JWT認證與授權機制
   - Swagger/OpenAPI文檔生成
   - API版本控制
   - 統一的錯誤處理

3. **資料庫交互**
   - GORM作為ORM工具
   - Repository模式隔離資料庫操作
   - 資料庫遷移與版本控制
   - 多租戶隔離實現

4. **緩存層 (Redis)**
   - 多級緩存策略
   - 菜單數據緩存
   - 用戶會話與權限緩存
   - 訂單處理暫存
   - 分佈式鎖實現並發控制

5. **消息隊列整合 (NATS)**
   - 事件驅動架構
   - 訂單處理流程的異步通信
   - 出單任務隊列處理
   - 系統事件通知與監控

6. **監控與日誌**
   - Prometheus + Grafana監控系統效能
   - ELK Stack或Loki進行日誌管理
   - 告警機制設置

7. **安全性配置**
   - SSL證書（Let's Encrypt）
   - HTTPS強制啟用
   - 敏感數據加密存儲

8. **硬體整合**
   - CP-Q3X感熱式出單機驅動接口
   - 設備狀態檢測與錯誤恢復
   - 預留多設備支援擴展接口

9. **測試策略**
   - testify單元測試框架
   - 集成測試
   - 端對端測試
   - 性能測試

### 前端技術

1. **管理後台界面**
   - **框架**: React + Material Dashboard 2 React
   - **狀態管理**: Redux/Context API
   - **類型系統**: TypeScript
   - **測試**: Jest
   - **響應式設計**: 適配平板至桌面

2. **店家前端界面**
   - **框架**: React
   - **狀態管理**: Redux/Context API
   - **類型系統**: TypeScript
   - **測試**: Jest
   - **優化**: 觸控友好設計

3. **離線功能**
   - IndexedDB本地存儲
   - 離線操作與同步機制
   - 網絡狀態監測與恢復

### 資料庫設計

1. **PostgreSQL核心表結構**

   **店家表(tenants)**
   ```
   tenant_id: UUID (PK)
   name: VARCHAR(255)
   address: TEXT
   contact_info: JSONB
   logo_url: VARCHAR(255)
   active: BOOLEAN
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

   **使用者表(users)**
   ```
   user_id: UUID (PK)
   tenant_id: UUID (FK to tenants)
   username: VARCHAR(100)
   password_hash: VARCHAR(255)
   full_name: VARCHAR(255)
   role: VARCHAR(50)
   active: BOOLEAN
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

   **菜品表(items)**
   ```
   item_id: UUID (PK)
   tenant_id: UUID (FK to tenants)
   category_id: UUID (FK to categories)
   name: VARCHAR(255)
   description: TEXT
   price: DECIMAL(10,2)
   image_url: VARCHAR(255)
   options: JSONB
   active: BOOLEAN
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

   **分類表(categories)**
   ```
   category_id: UUID (PK)
   tenant_id: UUID (FK to tenants)
   name: VARCHAR(100)
   display_order: INTEGER
   active: BOOLEAN
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

   **訂單表(orders)**
   ```
   order_id: UUID (PK)
   tenant_id: UUID (FK to tenants)
   order_number: VARCHAR(50)
   order_type: VARCHAR(50) [dine_in, takeout]
   table_number: VARCHAR(20)
   status: VARCHAR(50)
   total_amount: DECIMAL(10,2)
   payment_method: VARCHAR(50)
   created_by: UUID (FK to users)
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

   **訂單明細表(order_items)**
   ```
   order_item_id: UUID (PK)
   order_id: UUID (FK to orders)
   item_id: UUID (FK to items)
   quantity: INTEGER
   unit_price: DECIMAL(10,2)
   options: JSONB
   notes: TEXT
   created_at: TIMESTAMP
   ```

   **設備表(devices)**
   ```
   device_id: UUID (PK)
   tenant_id: UUID (FK to tenants)
   name: VARCHAR(100)
   type: VARCHAR(50)
   connection_info: JSONB
   status: VARCHAR(50)
   last_active: TIMESTAMP
   created_at: TIMESTAMP
   updated_at: TIMESTAMP
   ```

2. **多租戶設計**
   - 使用Schema隔離不同店家數據
   - 或通過tenant_id欄位進行軟隔離
   - 所有查詢必須加入租戶條件

### 消息隊列

1. **NATS訊息模式**
   - 主題(Subject)命名規則: `tenant.<tenant_id>.<service>.<event>`
   - 例: `tenant.123.order.created`, `tenant.123.printer.job`

2. **核心事件**
   - 訂單創建: `order.created`
   - 訂單狀態變更: `order.status_changed`
   - 打印任務: `printer.job`
   - 用戶活動: `user.activity`
   - 系統事件: `system.event`

### 緩存策略

1. **Redis緩存鍵設計**
   - 格式: `tenant:<tenant_id>:<entity>:<id>`
   - 例: `tenant:123:menu:categories`, `tenant:123:item:456`

2. **緩存策略**
   - 菜單數據: TTL 15分鐘
   - 用戶會話: TTL 24小時
   - 活躍訂單: TTL 4小時
   - 系統配置: TTL 1小時

3. **緩存失效策略**
   - 寫操作時主動失效相關緩存
   - 定時任務清理過期數據
   - 通過Redis發布/訂閱機制通知緩存更新

## 硬體需求

1. **店家前端設備**
   - **安卓平板**搭配**專用支架**（主要操作終端）
   - CP-Q3X感熱式出單機（收據與廚房訂單打印）
   - 錢箱（與系統連接自動開啟）
   - 備用4G/5G路由器（網路備援）

2. **伺服器基礎設施**
   - 雲端服務器（AWS/GCP/Azure中型實例）
   - 或本地NUC迷你電腦伺服器（小型店家選項）
   - UPS不斷電系統（本地部署時使用）

3. **安卓平板推薦規格**
   - 螢幕尺寸: 10-12寸
   - 處理器: 八核心或更高
   - 記憶體: 至少4GB RAM
   - 存儲: 至少64GB
   - 操作系統: Android 10或更高版本
   - 連接: WiFi + 藍牙 (選配4G/5G)

4. **出單機規格**
   - 型號: CP-Q3X感熱式出單機
   - 連接方式: WiFi/USB/藍牙
   - 紙張寬度: 80mm
   - 列印速度: >150mm/s

## 開發與部署流程

1. **開發環境**
   - Docker Desktop本地開發環境
   - Docker Compose配置(PostgreSQL、Redis、NATS)
   - 熱重載工具
   - 模擬硬體設備

2. **版本控制**
   - Git工作流
   - 功能分支開發
   - Pull Request代碼審查流程
   - 語義化版本控制

3. **CI/CD流程**
   - GitHub Actions自動部署
   - 自動化測試
   - 代碼質量檢查
   - 安全漏洞掃描

4. **部署策略**
   - 多環境部署(開發、測試、生產)
   - 藍綠部署
   - 容器化部署
   - 環境變數管理

5. **監控與告警**
   - Prometheus + Grafana監控
   - ELK Stack/Loki日誌分析
   - 性能監控
   - 業務監控
   - 告警設置

6. **備份策略**
   - 數據庫自動備份
   - 多區域備份
   - 快速恢復流程

## UI設計規範

### 色彩方案

#### 後台管理界面色彩方案

**主色調**
- **主色 (Primary)**: `#2D3748` - 深沉藍灰色，專業且不易疲勞
- **次要色 (Secondary)**: `#4A5568` - 中性灰色，用於次要元素
- **強調色 (Accent)**: `#3182CE` - 活潑藍色，用於重點元素與交互
- **成功色 (Success)**: `#48BB78` - 清新綠色，表示成功與完成
- **警示色 (Warning)**: `#ED8936` - 暖橙色，用於警告與提示

**搭配色**
- 背景色: `#F7FAFC` - 淺灰白色，提供乾淨清爽的底色
- 卡片/面板背景: `#FFFFFF` - 純白色
- 文字主色: `#1A202C` - 近黑色，確保可讀性
- 文字次要色: `#718096` - 中性灰色，用於次要信息
- 分隔線: `#E2E8F0` - 淺灰色，用於界面分隔

#### 店家前端色彩方案

**主色調**
- **主色 (Primary)**: `#2C5282` - 深藍色，沉穩且不刺眼
- **次要色 (Secondary)**: `#4299E1` - 明亮藍色，用於互動元素
- **強調色 (Accent)**: `#E53E3E` - 活力紅色，用於關鍵按鈕與提示
- **成功色 (Success)**: `#38A169` - 明亮綠色，視覺反饋更鮮明
- **警示色 (Warning)**: `#DD6B20` - 深橙色，用於重要提醒

**搭配色**
- 背景色: `#EDF2F7` - 淺灰藍色，降低長時間使用的視覺疲勞
- 按鈕/操作區背景: `#FFFFFF` - 純白色，突出操作區
- 文字主色: `#1A202C` - 近黑色，確保在光線變化下仍清晰可見
- 分類標籤色: `#EBF8FF`, `#F0FFF4`, `#FFFAF0` - 淺色系背景區分不同分類
- 點餐高亮: `#FEB2B2` - 淺紅色，用於已選項目的視覺反饋

### 風格指南

#### 後台管理界面

**視覺風格**
- 簡潔商務型設計
- Material Design扁平化風格
- 留白適當，減少視覺雜訊
- 卡片式布局，信息分區明確

**排版**
- 主標題: 20-24px, Roboto Medium
- 次標題: 16-18px, Roboto Medium
- 正文: 14px, Roboto Regular
- 次要文字: 12px, Roboto Light
- 行高: 1.5倍字體大小

**組件風格**
- 按鈕: 圓角矩形 (4px圓角)，適當陰影
- 表單: 簡潔邊框，聚焦時顯示主色
- 表格: 隔行淺灰底色，提高可讀性
- 圖表: 簡潔設計，色彩與系統一致

#### 店家前端界面

**視覺風格**
- 觸控友好型設計
- 大尺寸交互元素
- 清晰視覺層級
- 減少不必要裝飾

**排版**
- 主標題: 22-26px, Noto Sans TC Bold
- 按鈕文字: 18-20px, Noto Sans TC Medium
- 菜品名稱: 16-18px, Noto Sans TC Regular
- 價格/信息: 14-16px, Noto Sans TC Regular
- 行高: 1.3倍字體大小

**組件風格**
- 按鈕: 大尺寸 (至少56px高)，明顯陰影
- 分類標籤: 圓角設計，顏色區分不同類別
- 菜品卡片: 簡潔邊框，點擊時有明顯反饋
- 數字鍵盤: 大按鍵，清晰視覺反饋

#### 響應性與一致性原則

1. **響應性設計**
   - 後台支援從平板到桌面的靈活布局
   - 店家前端優化觸控操作，支援不同尺寸平板

2. **一致性原則**
   - 相同功能使用一致的色彩與交互模式
   - 系統反饋與提示使用統一的視覺語言
   - 間距與邊距使用8px的倍數設計網格

3. **無障礙設計**
   - 確保色彩對比度符合WCAG AA標準
   - 提供足夠大的點擊區域
   - 重要信息不僅依靠顏色傳達

4. **品牌可擴展性**
   - 預留店家Logo與品牌色整合位置
   - 設計可被不同店家品牌調色的模板

## 擴展性考量

1. **多店家擴展**
   - 數據庫層面多租戶隔離
   - API路由包含租戶標識
   - 權限系統支持跨店角色
   - 資源共享與隔離機制

2. **功能擴展**
   - 預留會員管理系統接口
   - 預留庫存管理系統接口
   - 預留報表分析系統接口
   - 預留外部系統整合接口（如外送平台）

3. **技術擴展**
   - 微服務架構預留
   - 資料庫水平擴展考量
   - API版本控制
   - 第三方服務整合接口

4. **硬體擴展**
   - 多種打印機支持
   - 條碼掃描器集成
   - 電子支付終端整合
   - 自助點餐設備兼容

## 第一階段實施計劃

### 階段目標
完成單一店家基礎POS系統，包括後台管理和店家前端，支持基本的點餐、結帳和出單功能。

### 時間規劃
總計12週，分為以下階段：

1. **準備階段 (2週)**
   - 需求確認與細節規劃
   - 開發環境搭建
   - 技術選型與架構設計
   - 數據庫設計

2. **核心開發 (6週)**
   - 後端API開發 (3週)
   - 前端界面開發 (3週)
   - 打印機驅動整合 (1週)
   - 並行進行單元測試

3. **整合與測試 (2週)**
   - 系統整合測試
   - 用戶體驗測試
   - 性能測試與優化

4. **部署與上線 (2週)**
   - 環境配置與部署
   - 上線準備
   - 用戶培訓
   - 上線後支持

### 優先實施功能
1. 基礎認證與店家設置
2. 菜單管理功能
3. 點餐與訂單處理流程
4. 結帳功能
5. 出單功能
6. 基本訂單管理

### 延後實施功能
1. 高級報表功能
2. 詳細的權限管理
3. 高級菜單選項配置
4. 多種支付方式整合
5. 會員管理系統
