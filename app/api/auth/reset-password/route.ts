import { prisma } from '@/lib/prisma';
import { z } from '@/lib/zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const ResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ResetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { token, password } = parsed.data;
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Falta NEXTAUTH_SECRET' }, { status: 500 });
    }

    let payload: { uid: string; email?: string };
    try {
      payload = jwt.verify(token, secret) as { uid: string; email?: string };
    } catch {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: payload.uid }, data: { password: hashed } });

    return NextResponse.json({ message: 'Contraseña actualizada' }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
