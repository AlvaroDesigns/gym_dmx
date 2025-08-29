import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener eventos de clase para un rango de fechas
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
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Se requieren fechas de inicio y fin' },
        { status: 400 },
      );
    }

    const userClasses = await prisma.userClass.findMany({
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
            id: true,
            name: true,
            surname: true,
            email: true,
            instagram: true,
            tiktok: true,
            privateProfile: true,
            roles: true,
          },
        },
      },
    });

    // Agrupar por ocurrencia de clase (classId + fecha-hora exacta)
    const grouped = new Map<string, typeof userClasses>();
    for (const uc of userClasses) {
      const key = `${uc.classId}__${uc.date.toISOString()}`;
      const list = grouped.get(key) || [];
      list.push(uc);
      grouped.set(key, list);
    }

    const calendarEvents = Array.from(grouped.entries()).map(([key, list]) => {
      const first = list[0];
      const startIso = first.date.toISOString();
      const startTime = first.date.toTimeString().slice(0, 5);
      const endTime = new Date(first.date.getTime() + 60 * 60 * 1000)
        .toTimeString()
        .slice(0, 5);
      const monitorUser = list.find(
        (uc) => uc.user.roles.includes('EMPLOYEE') || uc.user.roles.includes('ADMIN'),
      );
      const monitorName = monitorUser
        ? [monitorUser.user.name, monitorUser.user.surname].filter(Boolean).join(' ')
        : undefined;
      const participantsList = list
        .map((i) => ({
          id: i.user.id,
          name: i.user.name,
          surname: i.user.surname,
          email: i.user.email,
          instagram: i.user.instagram,
          tiktok: i.user.tiktok,
          privateProfile: i.user.privateProfile,
        }))
        .filter((u) => !!u.id);

      return {
        id: key,
        date: startIso.split('T')[0],
        label: first.class.name,
        description: first.class.description,
        color: first.class.color,
        room: first.class.room,
        monitor: monitorName,
        startTime,
        endTime,
        participants: participantsList.length,
        maxCapacity: first.class.maxCapacity,
        participantsList,
      };
    });

    return NextResponse.json(calendarEvents);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear un nuevo evento de clase
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
