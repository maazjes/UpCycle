export interface TokenUser {
    id: string;
    bio?: string;
    photoUrl?: string;
    email: string;
    displayName: string;
    username: string;
    idToken: string;
    refreshToken: string;
  }