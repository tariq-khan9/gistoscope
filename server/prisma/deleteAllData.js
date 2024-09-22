import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAndSeedDatabase() {
  try {
    // Truncate all tables and reset identity (auto-increment IDs)
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE "VersionEdit", "Edit", "Version", "Gist", "User" RESTART IDENTITY CASCADE;
    `);

    console.log('All records deleted and identities reset.');

    // Create a single user
    const newUser = await prisma.user.create({
      data: {
        username: 'newuser',
        password: 'password123',
        name: 'John Doe',
        image: null
      },
    });

    console.log('Single user created:', newUser);

  } catch (error) {
    console.error('Error resetting database and creating user:', error);
  } finally {
    // Close the Prisma connection
    await prisma.$disconnect();
  }
}

resetAndSeedDatabase();
