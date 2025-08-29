import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// POST - Crear una nueva zona
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
    const { name, description, imageUrl } = body;

    // Validar que el nombre sea requerido
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre de la zona es requerido' },
        { status: 400 },
      );
    }

    const existingZone = await prisma.zone.findUnique({
      where: { name },
    });

    if (existingZone) {
      return NextResponse.json(
        { error: 'Ya existe una zona con ese nombre' },
        { status: 400 },
      );
    }

    // Crear la nueva zona
    const zone = await prisma.zone.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(
      { message: 'Zona creada exitosamente', zone },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET - Obtener todas las zonas o una zona específica
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
    const zone = await prisma.zone.findMany({
      include: {
        classes: true, // Incluir las clases asociadas
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!zone) {
      return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
    }

    return NextResponse.json(zone, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Actualizar una zona existente
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
    const { id, name, description, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de la zona es requerido' }, { status: 400 });
    }

    // Verificar si la zona existe
    const existingZone = await prisma.zone.findUnique({
      where: { id },
    });

    if (!existingZone) {
      return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
    }

    // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
    if (name && name !== existingZone.name) {
      const zoneWithSameName = await prisma.zone.findUnique({
        where: { name },
      });

      if (zoneWithSameName) {
        return NextResponse.json(
          { error: 'Ya existe una zona con ese nombre' },
          { status: 400 },
        );
      }
    }

    // Actualizar la zona
    const updatedZone = await prisma.zone.update({
      where: { id },
      data: {
        name: name || existingZone.name,
        description: description !== undefined ? description : existingZone.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existingZone.imageUrl,
      },
      include: {
        classes: true,
      },
    });

    return NextResponse.json(
      { message: 'Zona actualizada exitosamente', zone: updatedZone },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Eliminar una zona
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
      return NextResponse.json({ error: 'ID de la zona es requerido' }, { status: 400 });
    }

    // Verificar si la zona existe
    const existingZone = await prisma.zone.findUnique({
      where: { id },
      include: {
        classes: true,
      },
    });

    if (!existingZone) {
      return NextResponse.json({ error: 'Zona no encontrada' }, { status: 404 });
    }

    // Verificar si hay clases asociadas
    if (existingZone.classes.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la zona porque tiene clases asociadas' },
        { status: 400 },
      );
    }

    // Eliminar la zona
    await prisma.zone.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Zona eliminada exitosamente' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
