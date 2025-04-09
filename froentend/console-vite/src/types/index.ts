// 用戶介面定義
export interface User {
  user_id: string;
  tenant_id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff';
  active: boolean;
  created_at: string;
  updated_at: string;
}

// 菜單項目介面定義
export interface MenuItem {
  item_id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  options: ItemOption[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// 菜單項目選項介面定義
export interface ItemOption {
  option_id: string;
  name: string;
  price_adjustment: number;
}

// 菜品分類介面定義
export interface Category {
  category_id: string;
  tenant_id: string;
  name: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// 班次介面定義
export interface Shift {
  shift_id: string;
  tenant_id: string;
  start_time: string;
  end_time: string | null;
  start_user_id: string;
  end_user_id: string | null;
  start_cash_amount: number;
  end_cash_amount: number | null;
  notes: string | null;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

// API 響應格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分頁響應格式
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  data: T[];
} 