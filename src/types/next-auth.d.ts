import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  export interface User {
    _id?: string;
    name?: string;
    isVerified?: boolean;
    email?: string;
  }
  export interface Session {
    user: {
      _id?: string;
      name?: string;
      isVerified?: boolean;
      email?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    _id?: string;
    name?: string;
    isVerified?: boolean;
    email?: string;
  }
}
