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

    // Create a gist associated with the user
    const gist = await prisma.gist.create({
      data: {
        title: 'Sample Gist',
        userId: user.id,
      },
    });

    // Create a version associated with the gist
    const version = await prisma.version.create({
      data: {
        point: 'Initial version point',
        gistId: gist.id,
        userId: user.id,
      },
    });

    // Create two edits for the version
    const edit1 = await prisma.edit.create({
      data: {
        body: 'First edit for the version',
        versionId: version.id,
        userId: user.id
      },
    });

    const edit2 = await prisma.edit.create({
      data: {
       body: 'Second edit for the version',
        versionId: version.id,
        userId: user.id
      },
    });

    console.log('Database reset and single user, gist, version, and edits created:', {
      user,
      gist,
      version,
      edits: [edit1, edit2],
    });

  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
