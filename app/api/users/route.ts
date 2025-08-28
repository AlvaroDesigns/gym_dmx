import { hash } from 'bcryptjs';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { UserUpdateData } from '@/types/user';
import { Gender, PaymentStatus, PaymentType, Prisma, Role } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions);

    const body = await request.json();

    // Check if user with this DNI already exists
    const existingUser = await prisma.user.findUnique({
      where: { dni: body.dni },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this DNI already exists' },
        { status: 400 },
      );
    }

    // Check if user with this email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 },
      );
    }
    const hashedPassword = await hash('Test123', 10);
    const provinciaValue = body.provincia ?? body.province ?? '';
    let birthDateValue = body.birthDate ? new Date(body.birthDate) : new Date();
    if (isNaN(birthDateValue.getTime())) {
      birthDateValue = new Date();
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        surname: body.surname,
        lastName: body.lastname,
        birthDate: birthDateValue,
        gender: body.gender as Gender,
        dni: body.dni,
        phone: body.phone,
        postalCode: body.postalCode,
        address: body.address,
        city: body.city ?? provinciaValue ?? '',
        country: body.country,
        province: provinciaValue,
        email: body.email,
        password: hashedPassword,
        roles: body.roles || [Role.USER],
        privateProfile:
          typeof body.privateProfile === 'boolean' ? body.privateProfile : undefined,
      },
    });

    // 2. Crear pago asociado
    await prisma.payment.create({
      data: {
        userId: user.id,
        type: PaymentType.COMBO,
        price: 50,
        discount: 5,
        total: 45, // Assuming total is price - discount
        status: PaymentStatus.PAID,
        paymentDate: new Date(),
        nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });

    return NextResponse.json({ message: 'User created', user }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    //const session = await getServerSession(authOptions);

    const body = await request.json();
    const { dni, ...updateData } = body;

    if (!dni) {
      return NextResponse.json({ error: 'User DNI is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { dni },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if DNI is being changed and if it already exists
    if (updateData.dni && updateData.dni !== existingUser.dni) {
      const existingDni = await prisma.user.findUnique({
        where: { dni: updateData.dni },
      });

      if (existingDni) {
        return NextResponse.json(
          { error: 'User with this DNI already exists' },
          { status: 400 },
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 },
        );
      }
    }

    // Prepare update data
    const userUpdateData: UserUpdateData = {
      name: updateData.name,
      surname: updateData.surname,
      lastName: updateData.lastname,
      gender: updateData.gender as Gender,
      dni: updateData.dni,
      phone: updateData.phone,
      postalCode: updateData.postalCode,
      address: updateData.address,
      city: updateData.provincia,
      country: updateData.country,
      province: updateData.provincia,
      email: updateData.email,
      roles: updateData.roles || existingUser.roles,
      privateProfile:
        typeof updateData.privateProfile === 'boolean'
          ? updateData.privateProfile
          : undefined,
    };

    // Only update password if provided
    if (updateData.password) {
      const hashedPassword = await hash(updateData.password, 10);
      userUpdateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { dni },
      data: userUpdateData,
    });

    return NextResponse.json(
      { message: 'User updated', user: updatedUser },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const roles = searchParams.get('roles');
    const doc = searchParams.get('dni');
    const email = searchParams.get('email');

    // Construir filtro dinámico
    const where: Prisma.UserWhereInput = {};

    if (roles) {
      const roleValues = roles
        .split(',')
        .map((r) => r.trim())
        .filter((r): r is Role => ['USER', 'ADMIN', 'EMPLOYEE'].includes(r as Role));
      if (roleValues.length > 0) {
        where.roles = { hasSome: roleValues };
      }
    }

    if (doc) {
      where.dni = doc;
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        birthDate: true,
        gender: true,
        dni: true,
        phone: true,
        postalCode: true,
        address: true,
        city: true,
        province: true,
        email: true,
        createdAt: true,
        lastOrderDate: true,
        roles: true,
        country: true,
        lastName: true,
        name: true,
        surname: true,
        instagram: true,
        tiktok: true,
        privateProfile: true,
      },
    });

    return NextResponse.json(Array.isArray(users) ? users : [], { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('-----session', session);

    const body = await request.json();
    const { dni } = body;

    if (!dni) {
      return NextResponse.json({ error: 'User DNI is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { dni },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete associated payments first (due to foreign key constraints)
    await prisma.payment.deleteMany({
      where: { userId: existingUser.id },
    });

    // Delete associated user classes
    await prisma.userClass.deleteMany({
      where: { userId: existingUser.id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { dni },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
