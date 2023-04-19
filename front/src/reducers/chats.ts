import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Chat, ChatPage } from '@shared/types';
import { emptyPage } from 'util/constants';
import { concatPages } from 'util/helpers';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: null as ChatPage | null,
  reducers: {
    setChats(_state, action: PayloadAction<ChatPage | null>): ChatPage | null {
      return action.payload;
    },
    addChatPage(state, action: PayloadAction<ChatPage>): ChatPage {
      return concatPages(state || { ...emptyPage }, action.payload);
    },
    addChat(state, action: PayloadAction<Chat>): ChatPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset: offset + 1,
        totalItems: totalItems + 1,
        data: [action.payload, ...data]
      };
    },
    editChat(
      state,
      action: PayloadAction<Omit<Partial<Chat>, 'id'> & { id: number }>
    ): ChatPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset,
        totalItems,
        data: data.map(
          (chat): Chat => (chat.id !== action.payload.id ? chat : { ...chat, ...action.payload })
        )
      };
    }
  }
});

export default chatsSlice.reducer;
export const { setChats, addChatPage, addChat, editChat } = chatsSlice.actions;
