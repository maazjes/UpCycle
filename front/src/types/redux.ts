import store from '../util/configureStore';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DispatchFunc = () => AppDispatch;
