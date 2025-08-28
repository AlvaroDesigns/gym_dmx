import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Falta email o password en credentials');
          return null;
        }

        console.log('[Auth] Intentando login para', credentials.email);

        const user = await prisma.user.findFirst({
          where: { email: { equals: credentials.email, mode: 'insensitive' } },
        });

        console.log('[Auth] Usuario encontrado?', Boolean(user));

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log('[Auth] Contraseña válida?', isValid);

        if (!isValid) return null;

        // Bloquear login si el usuario está inactivo
        if (user.active === false) {
          console.log('[Auth] Usuario inactivo');
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as JWT & { id?: string; roles?: string[]; active?: boolean };
      if (user) {
        const u = user as {
          id?: string;
          email?: string;
          roles?: Role[];
          active?: boolean;
        };
        t.id = u.id;
        token.email = u.email ?? token.email;
        t.roles = u.roles?.map((r) => r.toString());
        t.active = u.active;
      }
      // Refrescar desde BBDD en cada ciclo si hay email
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          t.active = dbUser.active;
          t.roles = (dbUser.roles ?? []).map((r) => r.toString());
          t.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const t = token as JWT & { id?: string; roles?: string[]; active?: boolean };
        (session.user as { id?: string; roles?: string[]; active?: boolean }).id = t.id;
        session.user.email = token.email ?? session.user.email ?? undefined;
        (session.user as { id?: string; roles?: string[]; active?: boolean }).roles =
          t.roles;
        (session.user as { active?: boolean }).active = t.active;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
