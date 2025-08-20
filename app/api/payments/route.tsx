import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: { name: true, surname: true },
        },
      },
    });

    return NextResponse.json(Array.isArray(payments) ? payments : [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
