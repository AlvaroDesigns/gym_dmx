'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ROUTES_URL } from '@/config/url';
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
