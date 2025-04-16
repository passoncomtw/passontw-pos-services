import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

// 定義 RootState 類型
export type RootState = ReturnType<typeof rootReducer>;

// 創建 Saga 中間件
const sagaMiddleware = createSagaMiddleware();

// 創建 Redux Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 運行 Saga
sagaMiddleware.run(rootSaga);

export default store; 