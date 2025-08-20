/*
  Seed de los 20 primeros usuarios desde data/data.json
*/

import { Gender, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type RawUser = {
  name: string;
  surname: string;
  lastName?: string;
  birthDate: string; // dd/mm/yyyy
  gender: 'M' | 'F';
  dni: string;
  phone: number | string;
  postalCode: number | string;
  address: string;
  city?: string;
  country: string;
  email: string;
  ['Fecha de alta']?: string;
  lastOrderDate?: string;
};

function parseDate(d: string | undefined): Date {
  if (!d) return new Date('2000-01-01');
  const [dd, mm, yyyy] = d.split('/');
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(raw) as RawUser[];

  const first20 = users.slice(0, 20);
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  for (const u of first20) {
    if (!u.dni || !u.email) continue;
    await prisma.user.upsert({
      where: { dni: u.dni },
      update: {},
      create: {
        name: u.name?.toString().trim() || 'Nombre',
        surname: u.surname?.toString().trim() || 'Apellido',
        lastName: u.lastName?.toString().trim() || null,
        birthDate: parseDate(u.birthDate),
        gender: (u.gender as Gender) ?? 'M',
        dni: u.dni,
        phone: String(u.phone ?? ''),
        postalCode: String(u.postalCode ?? ''),
        address: u.address ?? '',
        city: u.city ?? '',
        province: '',
        email: u.email,
        country: u.country ?? '',
        password: defaultPasswordHash,
        roles: [Role.USER],
        lastOrderDate: u.lastOrderDate ? parseDate(u.lastOrderDate) : null,
      },
    });
  }

  console.log(`Seed completado: ${first20.length} usuarios`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
