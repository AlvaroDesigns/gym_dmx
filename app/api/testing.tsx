import { Gender, PaymentStatus, PaymentType, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear usuario de prueba
  console.log('⏳ Creando usuario de prueba...');
  const user = await prisma.user.create({
    data: {
      name: 'Carlos',
      surname: 'Pérez',
      lastName: 'García',
      birthDate: new Date('1990-05-12'),
      gender: Gender.M,
      dni: '7452236T',
      phone: '600123456',
      postalCode: '28001',
      address: 'Calle Mayor 123',
      city: 'Madrid',
      country: 'España',
      province: 'Madrid',
      email: 'carlos.perez@example.com',
      password: 'hashed-password', // aquí iría el hash real
      roles: [Role.USER],
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

  console.log('✅ Datos de prueba creados con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
