import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SharedGetMessagesQuery, SharedGetPostsQuery, SharedNewPostBody,
  SharedUpdateUserBody, TypedImage, SharedNewUserBody,
  FollowBase, UserBase, PaginationBase, EmailUser
} from '@shared/types';

export interface UpdateUserBody extends SharedUpdateUserBody {
  image?: { uri: string };
}

export interface NewUserBody extends SharedNewUserBody {
  image: TypedImage;
}

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery;

export interface NewPostBody extends SharedNewPostBody {
  categories: number[];
  images: TypedImage[];
}

export interface UpdatePostBody extends Partial<NewPostBody> {}

export interface Follow extends FollowBase {
  following?: UserBase;
  follower?: UserBase;
}

export interface FollowPage extends PaginationBase {
  data: Follow[];
}

export type GetMessagesQuery = PaginationQuery & SharedGetMessagesQuery;

export type PaginationQuery = {
  limit: number;
  offset: number;
};

export interface NotificationState {
  message: string;
  error: boolean;
}

// React Native Navigation

export type LoginStackParams = {
  'Login': undefined;
  'SignUp': undefined;
};

export type UserStackParams = {
  'StackSearch': undefined;
  'StackFavorites': { userId: string };
  'StackCreatePost': undefined;
  'StackChat': undefined;
  'SinglePost': { postId: number };
  'StackProfile': { userId?: string; username?: string };
  'EditPost': { postId: number };
  'EditProfile': EmailUser;
  'Chat': undefined;
  'SingleChat': { userId: string };
  'Follows': { userId: string; role: 'follower' | 'following' };
  'SelectCategory': { selectedCategories: React.MutableRefObject<string[]> };
};

export type UserTabsParams = {
  'Search': undefined;
  'Favorites': { userId: string };
  'Profile': undefined;
  'CreatePost': undefined;
  'Chat': undefined;
};

export type UserStackNavigation =
CompositeNavigationProp<NativeStackNavigationProp<UserStackParams>,
BottomTabNavigationProp<UserTabsParams>>;

export type LoginStackNavigation = NativeStackNavigationProp<LoginStackParams>;

export type UserStackScreen<S extends keyof UserStackParams> =
NativeStackScreenProps<UserStackParams, S>;

// SocketIO

export interface ServerToClientEvents {
  message: ({ content, createdAt }: { content: string; createdAt: string }) => void;
}

export interface ClientToServerEvents {
  message: ({ content, chatId, createdAt }:
  { content: string; chatId: number; createdAt: string }) => void;
  join: (chatId: number) => void;
  leave: (chatId: number) => void;

}
