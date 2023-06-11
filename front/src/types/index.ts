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
  Post,
  User,
  PostPage,
  Message
} from '@shared/types';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
  AddPhoto: SharedNewUserBody;
  ResetPassword: undefined;
};

export type UserStackParams = {
  StackSearch: undefined;
  StackFavorites: undefined;
  StackCreatePost: undefined;
  StackChats: undefined;
  SinglePost: { postId: number };
  StackProfile?: ProfileProps;
  EditPost: Post;
  EditProfile: User;
  SingleChat: { userId: string; username: string };
  Follows: { userId: string; role: 'follower' | 'following'; username: string };
  LightBox: { uri: string };
  Settings: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
};

export interface ProfileProps {
  id: string;
  username: string;
}

export type UserTabsParams = {
  Search: NavigatorScreenParams<UserStackParams>;
  Favorites: NavigatorScreenParams<UserStackParams>;
  Profile: NavigatorScreenParams<UserStackParams>;
  CreatePost: NavigatorScreenParams<UserStackParams>;
  Chats: NavigatorScreenParams<UserStackParams>;
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
  message: (message: Message) => void;
}

export interface ClientToServerEvents {
  message: (message: Message) => void;
}

// components

export type MenuModalItems = { [key: string]: () => void };

export interface MenuModalProps extends Omit<ModalProps, 'children'> {
  items: MenuModalItems;
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

export interface GlobalState {
  currentUserId: string | null;
  loggedIn: boolean;
  favorites: PostPage | null;
  profilePosts: PostPage | null;
  singlePost: Post | null;
  profileUser: User | null;
}
