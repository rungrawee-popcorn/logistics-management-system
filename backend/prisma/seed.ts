import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.trackingLocation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword: string = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@system.com',
      phone: '0000000000',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      fullName: 'Customer User',
      email: 'customer@system.com',
      phone: '1111111111',
      passwordHash: hashedPassword,
      role: UserRole.CUSTOMER,
    },
  });

  const riderUser = await prisma.user.create({
    data: {
      fullName: 'Rider User',
      email: 'rider@system.com',
      phone: '2222222222',
      passwordHash: hashedPassword,
      role: UserRole.RIDER,
    },
  });

  await prisma.rider.create({
    data: {
      userId: riderUser.id,
      vehicleType: 'MOTORBIKE',
      licensePlate: 'ABC-123',
      status: 'AVAILABLE',
    },
  });

  console.log({ admin, customer, riderUser });
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
