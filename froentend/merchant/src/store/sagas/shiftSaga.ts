import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchShiftsRequest, 
  fetchShiftsSuccess, 
  fetchShiftsFailure,
  fetchCurrentShiftRequest,
  fetchCurrentShiftSuccess,
  fetchCurrentShiftFailure,
  startShiftRequest,
  startShiftSuccess,
  startShiftFailure,
  endShiftRequest,
  endShiftSuccess,
  endShiftFailure,
  Shift
} from '../reducers/shiftReducer';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'http://api.example.com' // 替換為實際的 API 地址
  : 'http://localhost:8080';

// API 請求函數
const fetchShiftsApi = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/shifts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchCurrentShiftApi = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/shifts/current`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const startShiftApi = (data: { startCashAmount: number; notes?: string }) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/shifts/start`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const endShiftApi = (shiftId: string, data: { endCashAmount: number; notes?: string }) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/shifts/${shiftId}/end`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 模擬數據
const mockShifts: Shift[] = [
  {
    id: '1',
    startTime: '2023-04-08T08:00:00Z',
    endTime: '2023-04-08T16:00:00Z',
    startUserId: '123',
    endUserId: '123',
    startCashAmount: 1000,
    endCashAmount: 3500,
    notes: '早班交接正常',
    status: 'closed',
    totalOrders: 45,
    totalSales: 2500,
  },
  {
    id: '2',
    startTime: '2023-04-09T08:00:00Z',
    endTime: '2023-04-09T16:00:00Z',
    startUserId: '123',
    endUserId: '123',
    startCashAmount: 1000,
    endCashAmount: 4200,
    notes: '有一筆退款',
    status: 'closed',
    totalOrders: 52,
    totalSales: 3200,
  },
  {
    id: '3',
    startTime: '2023-04-10T08:00:00Z',
    endTime: null,
    startUserId: '123',
    endUserId: null,
    startCashAmount: 1000,
    endCashAmount: null,
    notes: null,
    status: 'active',
    totalOrders: 20,
    totalSales: 1500,
  },
];

// Saga 函數
function* fetchShiftsSaga() {
  try {
    // 正式環境
    // const response = yield call(fetchShiftsApi);
    // yield put(fetchShiftsSuccess(response.data));
    
    // 開發模擬數據
    yield put(fetchShiftsSuccess(mockShifts));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(fetchShiftsFailure(error.response.data.message || '獲取交班記錄失敗'));
    } else {
      yield put(fetchShiftsFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

function* fetchCurrentShiftSaga() {
  try {
    // 正式環境
    // const response = yield call(fetchCurrentShiftApi);
    // yield put(fetchCurrentShiftSuccess(response.data));
    
    // 開發模擬數據
    const currentShift = mockShifts.find(shift => shift.status === 'active') || null;
    yield put(fetchCurrentShiftSuccess(currentShift));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(fetchCurrentShiftFailure(error.response.data.message || '獲取當前班次失敗'));
    } else {
      yield put(fetchCurrentShiftFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

function* startShiftSaga(action: PayloadAction<{ startCashAmount: number; notes?: string }>) {
  try {
    // 正式環境
    // const response = yield call(startShiftApi, action.payload);
    // yield put(startShiftSuccess(response.data));
    
    // 開發模擬數據
    const newShift: Shift = {
      id: `new-${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: null,
      startUserId: '123',
      endUserId: null,
      startCashAmount: action.payload.startCashAmount,
      endCashAmount: null,
      notes: action.payload.notes || null,
      status: 'active',
      totalOrders: 0,
      totalSales: 0,
    };
    yield put(startShiftSuccess(newShift));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(startShiftFailure(error.response.data.message || '開始班次失敗'));
    } else {
      yield put(startShiftFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

function* endShiftSaga(action: PayloadAction<{ endCashAmount: number; notes?: string }>) {
  try {
    // 先找到當前活動的班次
    const currentShift = mockShifts.find(shift => shift.status === 'active');
    
    if (!currentShift) {
      yield put(endShiftFailure('沒有找到活動中的班次'));
      return;
    }
    
    // 正式環境
    // const response = yield call(endShiftApi, currentShift.id, action.payload);
    // yield put(endShiftSuccess(response.data));
    
    // 開發模擬數據
    const endedShift: Shift = {
      ...currentShift,
      endTime: new Date().toISOString(),
      endUserId: '123',
      endCashAmount: action.payload.endCashAmount,
      notes: action.payload.notes || currentShift.notes,
      status: 'closed',
    };
    yield put(endShiftSuccess(endedShift));
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      yield put(endShiftFailure(error.response.data.message || '結束班次失敗'));
    } else {
      yield put(endShiftFailure('伺服器錯誤，請稍後再試'));
    }
  }
}

// 主 Saga
export default function* shiftSaga() {
  yield takeLatest(fetchShiftsRequest.type, fetchShiftsSaga);
  yield takeLatest(fetchCurrentShiftRequest.type, fetchCurrentShiftSaga);
  yield takeLatest(startShiftRequest.type, startShiftSaga);
  yield takeLatest(endShiftRequest.type, endShiftSaga);
} 