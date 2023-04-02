import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ModalProps, TextInput, TextInputProps } from 'react-native';
import {
  SharedGetMessagesQuery,
  SharedGetPostsQuery,
  SharedNewPostBody,
  TypedImage,
  SharedNewUserBody,
  FollowBase,
  UserBase,
  PaginationBase,
  Post,
  User
} from '@shared/types';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

export interface UpdateUserBody extends Partial<NewUserBody> {}

export interface NewUserBody extends SharedNewUserBody {
  images: TypedImage[];
}

export interface FinalNewUserBody extends Omit<NewUserBody, 'images'> {
  image: string | null;
}

export interface FinalUpdateUserBody extends Partial<FinalNewUserBody> {}

export interface AuthStorageUser {
  id: string;
  refreshToken: string;
  photoUrl: string | null;
  username: string;
}

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery;

export type SearchPostsQuery = Pick<
  SharedGetPostsQuery,
  'contains' | 'categoryId' | 'condition' | 'city'
>;

export interface NewPostBody extends SharedNewPostBody {
  categories: number[];
  images: TypedImage[];
}

export interface FinalNewPostBody extends Omit<NewPostBody, 'images'> {
  images: string[];
}

export interface UpdatePostBody extends Partial<NewPostBody> {}

export interface FinalUpdatePostBody extends Partial<FinalNewPostBody> {}

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
  modal: boolean;
}

// React Native Navigation

export type LoginStackParams = {
  Login: undefined;
  VerifyEmail: undefined;
  AddInformation: { email: string };
  AddPhoto: {
    email: string;
    displayName: string;
    username: string;
    bio: string;
    password: string;
  };
  ResetPassword: undefined;
};

export type UserStackParams = {
  StackSearch: undefined;
  StackFavorites: undefined;
  StackCreatePost: undefined;
  StackChat: undefined;
  SinglePost: { postId: number };
  StackProfile?: ProfileProps | User;
  EditPost: Post;
  EditProfile: User;
  Chat: undefined;
  SingleChat: { userId: string };
  Follows: { userId: string; role: 'follower' | 'following' };
  SelectCategory: { selectedCategories: React.MutableRefObject<string[]> };
  LightBox: { uri: string };
};

export interface ProfileProps {
  id: string;
  username: string;
}

export type UserTabsParams = {
  Search: NavigatorScreenParams<UserStackParams>;
  Favorites: NavigatorScreenParams<UserStackParams>;
  Profile?: NavigatorScreenParams<UserStackParams>;
  CreatePost: NavigatorScreenParams<UserStackParams>;
  Chat: NavigatorScreenParams<UserStackParams>;
};

export type UserStackNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<UserStackParams>,
  BottomTabNavigationProp<UserTabsParams>
>;

export type LoginStackNavigation = NativeStackNavigationProp<LoginStackParams>;

export type UserScreen<S extends keyof (UserTabsParams & UserStackParams)> = NativeStackScreenProps<
  UserTabsParams & UserStackParams,
  S
>;

export type LoginStackScreen<S extends keyof LoginStackParams> = NativeStackScreenProps<
  LoginStackParams,
  S
>;

// SocketIO

export interface ServerToClientEvents {
  message: ({
    text,
    createdAt,
    images
  }: {
    text: string;
    createdAt: Date;
    images: TypedImage[];
  }) => void;
}

export interface ClientToServerEvents {
  message: ({
    text,
    receiverId,
    createdAt,
    images
  }: {
    text: string;
    receiverId: string;
    createdAt: Date;
    images: TypedImage[];
  }) => void;
  join: (chatId: number) => void;
  leave: (chatId: number) => void;
}

// components

export interface MenuModalProps extends Omit<ModalProps, 'children'> {
  items: { [key: string]: (...args: any[]) => any };
  searchbar?: boolean;
}

export interface PickerProps extends Omit<MenuModalProps, 'items'> {
  items: string[];
  selectedValue: string;
  onValueChange: (value?: string) => void;
}

export interface FormikTextInputProps extends TextInputProps {
  name: string;
  inputRef?: React.RefObject<TextInput>;
}
