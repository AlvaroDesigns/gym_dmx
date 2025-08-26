import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // No autenticado → opcional, redirigir a login
    //return NextResponse.redirect(new URL('/', request.url));
  }

  const tokenRolesUnknown = (token as { roles?: unknown })?.roles;
  const roles = Array.isArray(tokenRolesUnknown) ? (tokenRolesUnknown as string[]) : [];

  const isAdminOrEmployee = roles.includes('ADMIN') || roles.includes('EMPLOYEE');
  const isOnlyUser = roles.length === 1 && roles[0] === 'USER';

  // Caso: solo USER → restringir fuera de /user
  if (isOnlyUser && !pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/user/home', request.url));
  }

  // Caso: ADMIN o EMPLOYEE → acceso libre

  if (isAdminOrEmployee) {
    return NextResponse.next();
  }

  // Caso: roles vacíos o raros → opcional, enviarlo a login
  /**
 *   if (roles.length === 0) {
    return NextResponse.redirect(new URL('/', request.url));
  }
 */

  return NextResponse.next();
}

export const config = {
  // Aplica el middleware a todo excepto recursos estáticos y API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
