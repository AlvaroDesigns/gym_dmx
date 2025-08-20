import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener eventos de clase para un rango de fechas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Se requieren fechas de inicio y fin' },
        { status: 400 },
      );
    }

    const events = await prisma.userClass.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        class: true,
        user: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    // Transformar los datos para el calendario
    const calendarEvents = events.map((event) => ({
      id: event.id,
      date: event.date.toISOString().split('T')[0], // YYYY-MM-DD
      label: event.class.name,
      description: event.class.description,
      color: '#3b82f6',
      room: event.class.room,
      startTime: event.date.toTimeString().slice(0, 5), // HH:MM
      endTime: new Date(event.date.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5), // +1 hora
      participants: 1,
      maxCapacity: event.class.maxCapacity,
    }));

    return NextResponse.json(calendarEvents);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear un nuevo evento de clase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      className,
      description,
      date,
      startTime,
      endTime,
      room,
      maxCapacity,
      monitor,
      difficulty,
    } = body;

    // Validar campos requeridos
    if (
      !className ||
      !date ||
      !startTime ||
      !endTime ||
      !room ||
      !maxCapacity ||
      !monitor
    ) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos (incluido monitor)' },
        { status: 400 },
      );
    }

    // Validar que el monitor exista
    const monitorUser = await prisma.user.findUnique({ where: { id: monitor } });
    if (!monitorUser) {
      return NextResponse.json(
        { error: 'El monitor especificado no existe' },
        { status: 400 },
      );
    }

    // Crear la clase si no existe
    let classRecord = await prisma.class.findFirst({
      where: { name: className },
    });

    if (!classRecord) {
      classRecord = await prisma.class.create({
        data: {
          name: className,
          description: description || '',
          maxCapacity,
          room,
        },
      });
    }

    // Crear el evento de clase
    const classEvent = await prisma.userClass.create({
      data: {
        classId: classRecord.id,
        userId: monitor, // Usar el monitor seleccionado como usuario asociado al evento
        date: new Date(`${date}T${startTime}`),
      },
      include: {
        class: true,
      },
    });

    // Crear el horario si no existe
    const weekday = new Date(date)
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toUpperCase();
    await prisma.classSchedule.upsert({
      where: {
        id: `temp-${classRecord.id}-${weekday}`,
      },
      update: {},
      create: {
        classId: classRecord.id,
        weekday: weekday as
          | 'MONDAY'
          | 'TUESDAY'
          | 'WEDNESDAY'
          | 'THURSDAY'
          | 'FRIDAY'
          | 'SATURDAY'
          | 'SUNDAY',
        monitor: monitor || 'Sin asignar',
        difficulty: difficulty || 'MEDIUM',
        capacity: maxCapacity,
        startTime: new Date(`2000-01-01T${startTime}`),
        endTime: new Date(`2000-01-01T${endTime}`),
      },
    });

    return NextResponse.json(classEvent, { status: 201 });
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
