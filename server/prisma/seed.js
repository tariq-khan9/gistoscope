import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Truncate all tables and reset IDs to start from 1
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Gist", "Version", "Edit" RESTART IDENTITY CASCADE;`;

  // Seed users
  const user1 = await prisma.user.create({
    data: {
      username: 'tariq123',
      password: 'password123',
      name: 'Tariq',
      image: null,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'khan456',
      password: 'password456',
      name: 'Khan',
      image: null,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'bob456',
      password: 'password456',
      name: 'Bob',
      image: null,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      username: 'Smith456',
      password: 'password456',
      name: 'smith',
      image: null,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      username: 'Zayan456',
      password: 'password456',
      name: 'zayan',
      image: null,
    },
  });

  // Seed gists
  const gist1 = await prisma.gist.create({
    data: {
      title: 'First Gist',
      userId: user1.id,
    },
  });

  const gist2 = await prisma.gist.create({
    data: {
      title: 'Second Gist',
      userId: user2.id,
    },
  });

  const gist3 = await prisma.gist.create({
    data: {
      title: 'Third Gist',
      userId: user3.id,
    },
  });

  // Seed versions
  const version1 = await prisma.version.create({
    data: {
      point: '1 version of the 1 gist',
      userId: user1.id,
      gistId: gist1.id,
    },
  });

  const version2 = await prisma.version.create({
    data: {
      point: '2 version of the 1 gist',
      userId: user2.id,
      gistId: gist1.id,
    },
  });

  const version3 = await prisma.version.create({
    data: {
      point: '1 version of the 2 gist',
      userId: user3.id,
      gistId: gist2.id,
    },
  });

  const version4 = await prisma.version.create({
    data: {
      point: '1 version of the 3 gist',
      userId: user4.id,
      gistId: gist3.id,
    },
  });

  const version5 = await prisma.version.create({
    data: {
      point: '2 version of the 3 gist',
      userId: user5.id,
      gistId: gist3.id,
    },
  });

  // Seed edits
  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 1 of gist 1',
      userId: user1.id,
      versionId: version1.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 2 of version 1 of gist 1',
      userId: user2.id,
      versionId: version1.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 3 of gist 2',
      userId: user2.id,
      versionId: version3.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 2 of version 3 of gist 2',
      userId: user3.id,
      versionId: version3.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 2 of gist 1',
      userId: user4.id,
      versionId: version2.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 4 of gist 3',
      userId: user5.id,
      versionId: version4.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 2 of version 4 of gist 3',
      userId: user4.id,
      versionId: version4.id,
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 5 of gist 3',
      userId: user3.id,
      versionId: version5.id,
    },
  });

  console.log('Seed data created with IDs starting from 1!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
