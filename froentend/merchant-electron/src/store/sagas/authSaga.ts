import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure,
  logoutRequest,
  logoutSuccess,
  checkAuthState,
  authStateSuccess,
  authStateFailure
} from '../reducers/authReducer';
import { PayloadAction } from '@reduxjs/toolkit';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'http://api.example.com' // 替換為實際的 API 地址
  : 'http://localhost:8080';

// API 請求函數
const loginApi = (username: string, password: string) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

const fetchUserApi = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Saga 函數
function* loginSaga(action: PayloadAction<{ username: string; password: string }>) {
  try {
    // 模擬 API 調用
    // const response = yield call(loginApi, action.payload.username, action.payload.password);
    
    // 開發階段模擬成功的登入響應
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          name: '商家管理員',
          role: 'manager',
          tenantId: 'tenant-123'
        }
      }
    };

    yield put(loginSuccess({ 
      token: mockResponse.data.token, 
      user: mockResponse.data.user 
    }));

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(loginFailure(error.response.data.message || '登入失敗'));
    } else {
      yield put(loginFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

function* logoutSaga() {
  try {
    // 處理登出邏輯，如果需要呼叫後端 API
    yield put(logoutSuccess());
  } catch (error) {
    console.error('登出發生錯誤:', error);
    yield put(logoutSuccess()); // 即使出錯也強制登出前端
  }
}

function* checkAuthStateSaga() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      yield put(authStateFailure());
      return;
    }
    
    // 模擬在開發階段驗證 token
    const mockUser = {
      id: '123',
      name: '商家管理員',
      role: 'manager',
      tenantId: 'tenant-123'
    };
    
    // 正式環境取消註釋下面的代碼
    // const response = yield call(fetchUserApi);
    // yield put(authStateSuccess(response.data.user));
    
    yield put(authStateSuccess(mockUser));
    
  } catch (error) {
    yield put(authStateFailure());
  }
}

// 主 Saga
export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(checkAuthState.type, checkAuthStateSaga);
} 