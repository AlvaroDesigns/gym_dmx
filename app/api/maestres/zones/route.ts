import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener solo zonas en formato simplificado
export async function GET(request: NextRequest) {
  try {
    let isAuth = false;
    const session = await getServerSession(authOptions);
    if (session?.user) isAuth = true;
    if (!isAuth) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token) isAuth = true;
    }
    if (!isAuth) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const zones = await prisma.zone.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(
      {
        zones: zones.map((item) => ({
          text: item.name,
          value: item.name, // alineado con tu endpoint /api/maestres actual
        })),
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
