// app/api/tools/import-users/route.ts
export const runtime = 'nodejs';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { promises as fs } from 'fs';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import path from 'path';

type RawUser = {
  name: string;
  surname: string;
  lastName?: string;
  birthDate: string; // DD/MM/YYYY
  gender: 'M' | 'F';
  dni: string;
  phone: number | string;
  postalCode: number | string;
  address: string;
  city: string; // ciudad
  country?: string; // en tu JSON es provincia
  email: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let isAuth = Boolean(session?.user);
    if (!isAuth) {
      const token = await getToken({
        // NextRequest no es compatible aquí, el tipo nativo Request funciona en runtime nodejs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token) isAuth = true;
    }
    if (!isAuth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    // Opcional: restringir a ADMIN
    // const roles = (session.user as any)?.roles || [];
    // if (!roles.includes('ADMIN')) {
    //   return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    // }
    const file = path.join(process.cwd(), 'data/data.json');
    const raw = await fs.readFile(file, 'utf-8');
    const users: RawUser[] = (JSON.parse(raw) as RawUser[]).slice(0, 20);

    const hashed = await hash('Test123', 10);

    // Normaliza y crea en bloque (omite duplicados por email/dni)
    const data = users.map((u) => ({
      name: String(u.name ?? '').trim(),
      surname: String(u.surname ?? '').trim(),
      lastName: (u.lastName ?? '') || null,
      birthDate: dayjs(u.birthDate, 'DD/MM/YYYY').isValid()
        ? dayjs(u.birthDate, 'DD/MM/YYYY').toDate()
        : new Date('1990-01-01'),
      gender: u.gender,
      dni: String(u.dni),
      phone: String(u.phone ?? ''),
      postalCode: String(u.postalCode ?? ''),
      address: u.address ?? '',
      city: u.city ?? '', // ciudad
      country: 'España',
      province: u.country ?? '', // en tu JSON es provincia
      email: String(u.email),
      password: hashed,
      roles: ['USER'] as Role[],
    }));

    await prisma.user.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({ inserted: data.length }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
