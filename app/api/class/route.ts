import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { ScheduleInput } from '@/types';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

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
    const rawZoneId = body.zoneId as string | null | undefined;
    const normalizedZoneId =
      typeof rawZoneId === 'string' && rawZoneId.trim() === ''
        ? null
        : (rawZoneId ?? null);

    if (!name || !maxCapacity || !room) {
      return NextResponse.json(
        { error: 'Nombre, capacidad máxima y sala son campos requeridos' },
        { status: 400 },
      );
    }

    if (normalizedZoneId) {
      const zone = await prisma.zone.findUnique({ where: { id: normalizedZoneId } });
      if (!zone) {
        return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
      }
    }

    const schedulesInput: ScheduleInput[] = Array.isArray(schedules)
      ? (schedules as ScheduleInput[])
      : [];

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        maxCapacity: Number(maxCapacity),
        room,
        zoneId: normalizedZoneId,
        schedules: {
          create: schedulesInput.map((schedule) => ({
            weekday: schedule.weekday,
            monitor: schedule.monitor,
            difficulty: schedule.difficulty,
            capacity: schedule.capacity,
            startTime: new Date(`${schedule.startTime}`),
            endTime: new Date(`${schedule.endTime}`),
          })),
        },
      },
      include: {
        schedules: true,
        zone: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET - Obtener clases (todas o filtradas por id/zoneId)
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
    const id = searchParams.get('id');
    const zoneId = searchParams.get('zoneId');

    if (id) {
      const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
          schedules: true,
          zone: true,
          userClasses: true,
        },
      });

      if (!classItem) {
        return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
      }

      return NextResponse.json(classItem, { status: 200 });
    }

    const classes = await prisma.class.findMany({
      where: {
        ...(zoneId ? { zoneId } : {}),
      },
      include: {
        schedules: true,
        zone: true,
        userClasses: true,
      },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Actualizar una clase existente
export async function PUT(request: NextRequest) {
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
    const { id, name, description, maxCapacity, room } = body;
    const rawZoneId = body.zoneId as string | null | undefined;
    const hasZoneId = Object.prototype.hasOwnProperty.call(body, 'zoneId');
    const normalizedZoneId =
      typeof rawZoneId === 'string' && rawZoneId.trim() === ''
        ? null
        : (rawZoneId as string | null | undefined);

    if (!id) {
      return NextResponse.json({ error: 'ID de la clase es requerido' }, { status: 400 });
    }

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
    }

    if (normalizedZoneId) {
      const zone = await prisma.zone.findUnique({ where: { id: normalizedZoneId } });
      if (!zone) {
        return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name: name ?? existingClass.name,
        description: description !== undefined ? description : existingClass.description,
        maxCapacity:
          maxCapacity !== undefined ? Number(maxCapacity) : existingClass.maxCapacity,
        room: room ?? existingClass.room,
        // Si no viene zoneId no se modifica; si viene '' se desvincula (null)
        ...(hasZoneId ? { zoneId: normalizedZoneId ?? null } : {}),
      },
      include: {
        schedules: true,
        zone: true,
      },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Eliminar una clase
export async function DELETE(request: NextRequest) {
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de la clase es requerido' }, { status: 400 });
    }

    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: { userClasses: true, schedules: true },
    });

    if (!existingClass) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
    }

    if (existingClass.userClasses.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la clase porque tiene inscripciones asociadas' },
        { status: 400 },
      );
    }

    // Eliminar horarios asociados antes de eliminar la clase (si aplica)
    await prisma.classSchedule.deleteMany({ where: { classId: id } });
    await prisma.class.delete({ where: { id } });

    return NextResponse.json(
      { message: 'Clase eliminada exitosamente' },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
