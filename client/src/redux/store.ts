import { configureStore } from '@reduxjs/toolkit';
import gistReducer from './gistEditSlice';

const store = configureStore({
  reducer: {
    gistEdit: gistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
