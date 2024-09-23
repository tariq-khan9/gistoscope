import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // Delete all records from the database
    await prisma.edit.deleteMany();
    await prisma.version.deleteMany();
    await prisma.gist.deleteMany();
    await prisma.user.deleteMany();

    // Reset sequence of IDs for PostgreSQL
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Gist_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Version_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Edit_id_seq" RESTART WITH 1`;

    // Create a single user
    const user = await prisma.user.create({
      data: {
        username: 'tariq',
        password: 'password123',
        name: 'tariq khan',
        image: null,  // Optional
      },
    });

    console.log('Database reset and single user created:', user);
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
