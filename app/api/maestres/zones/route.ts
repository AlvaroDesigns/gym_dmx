import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET - Obtener solo zonas en formato simplificado
export async function GET() {
  try {
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
