import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, loginSuccess, loginFailure } from '../reducers/authReducer';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  role: string;
}

// 模擬 API 呼叫
const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'password') {
        resolve({
          id: '1',
          username: 'admin',
          role: 'admin',
        });
      } else {
        reject(new Error('帳號或密碼錯誤'));
      }
    }, 1000);
  });
};

function* handleLogin(action: PayloadAction<LoginCredentials>): Generator<unknown, void, User> {
  try {
    const user = yield call(loginApi, action.payload);
    yield put(loginSuccess(user));
  } catch (error) {
    if (error instanceof Error) {
      yield put(loginFailure(error.message));
    } else {
      yield put(loginFailure('登入失敗'));
    }
  }
}

export function* authSaga(): Generator {
  yield takeLatest(loginRequest.type, handleLogin);
} 