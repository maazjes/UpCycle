import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotificationState } from '../../types';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', error: false },
  reducers: {
    addNotification(_state, action: PayloadAction<NotificationState>): NotificationState {
      return action.payload;
    },
    deleteNotification(): NotificationState {
      return { message: '', error: false };
    }
  }
});

export default notificationSlice.reducer;
export const { addNotification, deleteNotification } = notificationSlice.actions;
