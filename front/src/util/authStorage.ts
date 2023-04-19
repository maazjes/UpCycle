import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenUser } from '@shared/types';

class AuthStorage {
  namespace: string;

  constructor(namespace: string = 'auth') {
    this.namespace = namespace;
  }

  async getUser(): Promise<TokenUser | null> {
    const token = await AsyncStorage.getItem(`${this.namespace}:user`);
    if (!token) {
      return null;
    }
    return JSON.parse(token) as TokenUser;
  }

  setUser(user: TokenUser): void {
    AsyncStorage.setItem(`${this.namespace}:user`, JSON.stringify(user));
  }

  removeUser(): void {
    AsyncStorage.removeItem(`${this.namespace}:user`);
  }
}

export default AuthStorage;
