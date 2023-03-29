import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStorageUser } from 'types';

class AuthStorage {
  namespace: string;

  constructor(namespace: string = 'auth') {
    this.namespace = namespace;
  }

  async getUser(): Promise<AuthStorageUser | null> {
    const token = await AsyncStorage.getItem(`${this.namespace}:user`);
    if (!token) {
      return null;
    }
    return JSON.parse(token) as AuthStorageUser;
  }

  setUser(user: AuthStorageUser): void {
    AsyncStorage.setItem(`${this.namespace}:user`, JSON.stringify(user));
  }

  removeUser(): void {
    AsyncStorage.removeItem(`${this.namespace}:user`);
  }
}

export default AuthStorage;
