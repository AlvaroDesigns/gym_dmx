import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener todas las clases
export async function GET() {
  try {
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
            schedules?.map((schedule: any) => ({
              weekday: schedule.weekday,
              monitor: schedule.monitor,
              difficulty: schedule.difficulty,
              capacity: schedule.capacity,
              startTime: new Date(`2000-01-01T${schedule.startTime}`),
              endTime: new Date(`2000-01-01T${schedule.endTime}`),
            })) || [],
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
