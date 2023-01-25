import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '../../types/redux';
import { addNotification, deleteNotification } from '.';

let timeoutId = 0;

const setNotification = (message: string, error: boolean):
ThunkAction<void, RootState, undefined, AnyAction> => (dispatch: AppDispatch): void => {
  clearTimeout(timeoutId);
  dispatch(addNotification({ message, error }));
  timeoutId = Number(setTimeout((): void => {
    dispatch(deleteNotification());
  }, 3000));
};

// eslint-disable-next-line import/prefer-default-export
export { setNotification };
