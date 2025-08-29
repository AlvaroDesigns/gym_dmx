import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Para no filtrar existencia de usuario, devolvemos 200 aunque no exista
    if (!user) {
      return NextResponse.json(
        { message: 'Si existe, se enviará un correo' },
        { status: 200 },
      );
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Falta NEXTAUTH_SECRET' }, { status: 500 });
    }

    const token = jwt.sign({ uid: user.id, email: user.email }, secret, {
      expiresIn: '15m',
    });
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/reset-password?token=${encodeURIComponent(
      token,
    )}`;

    // TODO: Enviar email real. Por ahora, devolvemos el enlace para pruebas.
    return NextResponse.json(
      { message: 'Enlace de reseteo generado', resetUrl },
      { status: 200 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
