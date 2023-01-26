// eslint-disable-next-line import/no-cycle
import store from '../util/store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DispatchFunc = () => AppDispatch;
