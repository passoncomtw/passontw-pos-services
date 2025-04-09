import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import shiftSaga from './shiftSaga';
import orderSaga from './orderSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(shiftSaga),
    fork(orderSaga),
  ]);
} 