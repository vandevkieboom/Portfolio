import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  const userUsername = process.env.USER_USERNAME;
  const userPassword = process.env.USER_PASSWORD;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!userUsername || !userPassword) {
    console.error('USER_USERNAME or USER_PASSWORD is not defined in the environment variables');
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: userUsername },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    await prisma.user.create({
      data: {
        username: userUsername,
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log('Normal user created');
  } else {
    console.log('Normal user already exists');
  }

  if (!adminUsername || !adminPassword) {
    console.error('ADMIN_USERNAME or ADMIN_PASSWORD is not defined in the environment variables');
    process.exit(1);
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
