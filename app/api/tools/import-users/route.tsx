// app/api/tools/import-users/route.ts
export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { promises as fs } from 'fs';
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

export async function POST() {
  try {
    const file = path.join(process.cwd(), 'data/data.json');
    const raw = await fs.readFile(file, 'utf-8');
    const users: RawUser[] = JSON.parse(raw).slice(0, 20);

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
      roles: ['USER'] as any,
    }));

    await prisma.user.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({ inserted: data.length }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
