import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

type BookingBody = {
  classId?: string;
  // O bien enviar un ISO completo
  dateTime?: string; // e.g. '2025-01-01T18:00'
  // O enviar fecha y hora separadas
  date?: string; // 'YYYY-MM-DD'
  startTime?: string; // 'HH:mm'
};

function parseOccurrenceDate(body: BookingBody): Date | null {
  if (body.dateTime) {
    const d = new Date(body.dateTime);
    return isNaN(d.getTime()) ? null : d;
  }
  if (body.date && body.startTime) {
    const d = new Date(`${body.date}T${body.startTime}`);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body: BookingBody = await request.json();
    const { classId } = body;

    if (!classId) {
      return NextResponse.json({ error: 'classId es requerido' }, { status: 400 });
    }

    // Permitir classId con sufijo "__ISO" (id__2025-08-27T12:30:00.000Z)
    const [pureClassId, isoSuffix] = (classId ?? '').split('__');
    const effectiveClassId = pureClassId || classId;

    let occurrenceDate = parseOccurrenceDate(body);
    if (!occurrenceDate && isoSuffix) {
      const parsed = new Date(isoSuffix);
      if (!isNaN(parsed.getTime())) occurrenceDate = parsed;
    }
    if (!occurrenceDate) {
      return NextResponse.json(
        { error: 'Fecha y hora inválidas. Use dateTime o date + startTime' },
        { status: 400 },
      );
    }

    const classRecord = await prisma.class.findUnique({
      where: { id: effectiveClassId },
    });
    if (!classRecord) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
    }

    // Validar duplicado para este usuario en la misma ocurrencia
    const existing = await prisma.userClass.findFirst({
      where: {
        userId,
        classId: effectiveClassId,
        date: occurrenceDate,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en esta actividad' },
        { status: 409 },
      );
    }

    // Validar aforo (se usa maxCapacity de la clase)
    const currentCount = await prisma.userClass.count({
      where: { classId: effectiveClassId, date: occurrenceDate },
    });
    if (currentCount >= (classRecord.maxCapacity ?? 0)) {
      return NextResponse.json(
        { error: 'Aforo completo para esta actividad' },
        { status: 409 },
      );
    }

    const booking = await prisma.userClass.create({
      data: {
        userId,
        classId: effectiveClassId,
        date: occurrenceDate,
      },
      include: {
        class: true,
        user: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    // Conflicto por restricción única (fallback)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in (error as Record<string, unknown>)
    ) {
      const code = (error as Record<string, unknown>).code;
      if (typeof code === 'string' && code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya estás inscrito en esta actividad' },
          { status: 409 },
        );
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body: BookingBody = await request.json();
    const { classId } = body;

    if (!classId) {
      return NextResponse.json({ error: 'classId es requerido' }, { status: 400 });
    }

    // Permitir classId con sufijo "__ISO" (id__2025-08-27T12:30:00.000Z)
    const [pureClassId, isoSuffix] = (classId ?? '').split('__');
    const effectiveClassId = pureClassId || classId;

    let occurrenceDate = parseOccurrenceDate(body);
    if (!occurrenceDate && isoSuffix) {
      const parsed = new Date(isoSuffix);
      if (!isNaN(parsed.getTime())) occurrenceDate = parsed;
    }
    if (!occurrenceDate) {
      return NextResponse.json(
        { error: 'Fecha y hora inválidas. Use dateTime o date + startTime' },
        { status: 400 },
      );
    }

    const existing = await prisma.userClass.findFirst({
      where: { userId, classId: effectiveClassId, date: occurrenceDate },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    await prisma.userClass.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: 'Reserva cancelada' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
