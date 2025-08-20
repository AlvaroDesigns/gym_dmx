import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener usuarios que son empleados (ADMIN o EMPLOYEE)
    const employees = await prisma.user.findMany({
      where: {
        roles: {
          hasSome: ['EMPLOYEE'],
        },
      },
      select: {
        id: true,
        name: true,
        surname: true,
        lastName: false,
        email: false,
        dni: false,
        phone: false,
        roles: false,
        createdAt: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Obtener todas las zonas
    const zones = await prisma.zone.findMany({
      select: {
        id: true,
        name: true,
        description: false,
        imageUrl: false,
        createdAt: false,
        updatedAt: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        description: false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(
      {
        employees: employees?.map((item) => {
          return {
            label: `${item.name} ${item.surname}`,
            value: item?.id,
          };
        }),
        zones: zones?.map((item) => {
          return {
            label: item?.name,
            value: item?.name,
          };
        }),
        classes: classes?.map((item) => {
          return {
            label: item?.name,
            value: item?.name,
          };
        }),
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
