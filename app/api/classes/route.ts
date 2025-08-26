import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener todas las clases
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
    const classes = await prisma.class.findMany({
      include: {
        schedules: true,
        userClasses: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error al obtener las clases:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear una nueva clase
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { name, description, maxCapacity, room, schedules } = body;

    // Validar campos requeridos
    if (!name || !maxCapacity || !room) {
      return NextResponse.json(
        { error: 'Nombre, capacidad máxima y sala son campos requeridos' },
        { status: 400 },
      );
    }

    // Crear la clase con sus horarios
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        maxCapacity,
        room,
        schedules: {
          create:
            schedules?.map(
              (schedule: {
                weekday: string;
                monitor: string;
                difficulty: string;
                capacity: number;
                startTime: string;
                endTime: string;
              }) => ({
                weekday: schedule.weekday,
                monitor: schedule.monitor,
                difficulty: schedule.difficulty,
                capacity: schedule.capacity,
                startTime: new Date(`2000-01-01T${schedule.startTime}`),
                endTime: new Date(`2000-01-01T${schedule.endTime}`),
              }),
            ) || [],
        },
      },
      include: {
        schedules: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error al crear la clase:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
