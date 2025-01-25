import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Truncate all tables and reset IDs to start from 1
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Gist", "Version", "Edit" RESTART IDENTITY CASCADE;`;

  const now = new Date();
  const pastDate = new Date(now.setFullYear(now.getFullYear() - 1));

  // Seed users
  const user1 = await prisma.user.create({
    data: {
      username: 'tariq123',
      password: 'password123',
      name: 'Tariq',
      image: null,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'khan456',
      password: 'password456',
      name: 'Khan',
      image: null,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  // Add other users similarly...

  // Seed gists
  const gist1 = await prisma.gist.create({
    data: {
      title: 'First Gist',
      userId: user1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist2 = await prisma.gist.create({
    data: {
      title: 'Second Gist',
      userId: user2.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist3 = await prisma.gist.create({
    data: {
      title: 'reply to first Gist',
      userId: user2.id,
      parentId: gist1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist4 = await prisma.gist.create({
    data: {
      title: 'second reply to first Gist',
      userId: user2.id,
      parentId: gist1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist5 = await prisma.gist.create({
    data: {
      title: 'third nested level Gist',
      userId: user2.id,
      parentId: gist3.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist6 = await prisma.gist.create({
    data: {
      title: 'third-2 nested level Gist',
      userId: user2.id,
      parentId: gist3.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist7 = await prisma.gist.create({
    data: {
      title: 'fourth nested level Gist',
      userId: user2.id,
      parentId: gist5.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  // Add other gists similarly...

  // Seed versions
  const version1 = await prisma.version.create({
    data: {
      point: '1 version of the 1 gist',
      userId: user1.id,
      gistId: gist1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version2 = await prisma.version.create({
    data: {
      point: '2 version of the 1 gist',
      userId: user2.id,
      gistId: gist1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version3 = await prisma.version.create({
    data: {
      point: ' version of the 2 gist',
      userId: user2.id,
      gistId: gist2.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version4 = await prisma.version.create({
    data: {
      point: ' version of the 3 gist',
      userId: user2.id,
      gistId: gist3.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version5 = await prisma.version.create({
    data: {
      point: ' version of the 4 gist',
      userId: user2.id,
      gistId: gist4.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version6 = await prisma.version.create({
    data: {
      point: ' version of the 5 gist',
      userId: user2.id,
      gistId: gist5.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version7 = await prisma.version.create({
    data: {
      point: ' version of the 6 gist',
      userId: user2.id,
      gistId: gist6.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const version8 = await prisma.version.create({
    data: {
      point: ' version of the 7 gist',
      userId: user2.id,
      gistId: gist7.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });
  // Add other versions similarly...

  // Seed edits
  await prisma.edit.create({
    data: {
      body: 'Edit 1 of version 1 of gist 1',
      userId: user1.id,
      versionId: version1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit 2 of version 1 of gist 1',
      userId: user2.id,
      versionId: version1.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 2',
      userId: user2.id,
      versionId: version2.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 3',
      userId: user2.id,
      versionId: version3.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 4',
      userId: user2.id,
      versionId: version4.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 5',
      userId: user2.id,
      versionId: version5.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 6',
      userId: user2.id,
      versionId: version6.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 7',
      userId: user2.id,
      versionId: version7.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  await prisma.edit.create({
    data: {
      body: 'Edit version 8',
      userId: user2.id,
      versionId: version8.id,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  


  


  


  


  


  


  // Add other edits similarly...

  console.log('Seed data created with timestamps!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
