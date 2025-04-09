import { ApiResponse, PaginatedResponse, User, MenuItem, Shift, Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 基本的 API 請求函數
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // 獲取儲存的權杖
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // 處理未授權錯誤
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || '請求失敗',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API 請求錯誤:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知錯誤',
    };
  }
}

// 常用 API 方法
export const api = {
  // GET 請求
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  // POST 請求
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT 請求
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE 請求
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// 使用者相關 API
export const userApi = {
  // 獲取使用者列表
  getUsers: () => api.get<PaginatedResponse<User>>('/users'),

  // 獲取單一使用者
  getUser: (userId: string) => api.get<User>(`/users/${userId}`),

  // 新增使用者
  createUser: (userData: Partial<User>) => api.post<User>('/users', userData),

  // 更新使用者
  updateUser: (userId: string, userData: Partial<User>) =>
    api.put<User>(`/users/${userId}`, userData),

  // 刪除使用者
  deleteUser: (userId: string) => api.delete<void>(`/users/${userId}`),
};

// 菜單相關 API
export const menuApi = {
  // 獲取菜品列表
  getItems: () => api.get<PaginatedResponse<MenuItem>>('/menu/items'),

  // 獲取單一菜品
  getItem: (itemId: string) => api.get<MenuItem>(`/menu/items/${itemId}`),

  // 新增菜品
  createItem: (itemData: Partial<MenuItem>) => api.post<MenuItem>('/menu/items', itemData),

  // 更新菜品
  updateItem: (itemId: string, itemData: Partial<MenuItem>) =>
    api.put<MenuItem>(`/menu/items/${itemId}`, itemData),

  // 刪除菜品
  deleteItem: (itemId: string) => api.delete<void>(`/menu/items/${itemId}`),

  // 獲取分類列表
  getCategories: () => api.get<Category[]>('/menu/categories'),
};

// 班次相關 API
export const shiftApi = {
  // 獲取班次列表
  getShifts: () => api.get<PaginatedResponse<Shift>>('/shifts'),

  // 獲取單一班次
  getShift: (shiftId: string) => api.get<Shift>(`/shifts/${shiftId}`),

  // 新增班次
  createShift: (shiftData: Partial<Shift>) => api.post<Shift>('/shifts', shiftData),

  // 更新班次
  updateShift: (shiftId: string, shiftData: Partial<Shift>) =>
    api.put<Shift>(`/shifts/${shiftId}`, shiftData),

  // 結束班次
  endShift: (shiftId: string, endData: Partial<Shift>) =>
    api.put<Shift>(`/shifts/${shiftId}/end`, endData),
}; 