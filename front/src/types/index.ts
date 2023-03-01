import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SharedGetMessagesQuery, SharedGetPostsQuery, SharedGetUsersQuery, NewPostBody, Image, TokenUser
} from '@shared/types';

export interface NotificationState {
  message: string;
  error: boolean;
}

export type PaginationQuery = {
  page: number;
  size: number;
};

export type GetUsersQuery = PaginationQuery & SharedGetUsersQuery;

export type GetMessagesQuery = PaginationQuery & SharedGetMessagesQuery;

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery & { postId?: number };

export interface InitialPostValues extends NewPostBody {
  images: Image[];
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type LoginStackParams = {
  'Login': undefined;
  'SignUp': undefined;
};

export type UserStackParams = {
  'StackHome': undefined;
  'StackFavorites': { userId: string };
  'StackCreatePost': undefined;
  'StackChat': undefined;
  'SinglePost': { postId: number };
  'StackProfile': { userId?: string; username?: string };
  'EditPost': { postId: number };
  'EditProfile': TokenUser;
  'Chat': undefined;
  'SingleChat': { userId: string };
};

export type UserTabsParams = {
  'Home': undefined;
  'Favorites': { userId: string };
  'Profile': undefined;
  'CreatePost': undefined;
  'Chat': undefined;
};

export interface ServerToClientEvents {
  message: ({ content, createdAt }: { content: string; createdAt: string }) => void;
}

export interface ClientToServerEvents {
  message: ({ content, chatId, createdAt }:
  { content: string; chatId: number; createdAt: string }) => void;
  join: (chatId: number) => void;
  leave: (chatId: number) => void;

}

export type UserStackNavigation =
CompositeNavigationProp<NativeStackNavigationProp<UserStackParams>,
BottomTabNavigationProp<UserTabsParams>>;

export type LoginStackNavigation = NativeStackNavigationProp<LoginStackParams>;

export type UserStackScreen<S extends keyof UserStackParams> =
NativeStackScreenProps<UserStackParams, S>;
