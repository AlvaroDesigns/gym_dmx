'use server';

import { ROUTES_URL } from '@/config/url';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function PostLogin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const roles = (session.user as { roles?: string[] } | undefined)?.roles ?? [];
  const isAdminOrEmployee = roles.includes('ADMIN') || roles.includes('EMPLOYEE');

  if (isAdminOrEmployee) {
    redirect(ROUTES_URL.DASHBOARD);
  }

  redirect('/user/home');
}
