import {
  PayloadAction, createSlice, AnyAction, ThunkAction
} from '@reduxjs/toolkit';
import { NotificationState } from '../types';
// eslint-disable-next-line import/no-cycle
import { RootState, AppDispatch } from '../types/redux';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', error: false, modal: false },
  reducers: {
    addNotification(_state, action: PayloadAction<NotificationState>): NotificationState {
      return action.payload;
    },
    deleteNotification(): NotificationState {
      return { message: '', error: false, modal: false };
    }
  }
});

let timeoutId = -1;

const setTimedNotification = (message: string, error: boolean):
ThunkAction<void, RootState, undefined, AnyAction> => (dispatch: AppDispatch): void => {
  const { addNotification, deleteNotification } = notificationSlice.actions;
  if (timeoutId !== -1) {
    clearTimeout(timeoutId);
  }
  dispatch(addNotification({ message, error, modal: false }));
  timeoutId = Number(setTimeout((): void => {
    dispatch(deleteNotification());
  }, 5000));
};

const { addNotification, deleteNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
export { addNotification, deleteNotification, setTimedNotification };
