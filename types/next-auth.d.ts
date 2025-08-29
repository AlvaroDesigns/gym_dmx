import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
      roles?: string[];
      active?: boolean;
      surname?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    roles?: string[];
    active?: boolean;
    surname?: string | null;
    name?: string | null;
  }
}
