import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Truncate all tables and reset IDs to start from 1
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Gist", "Version", "Edit" RESTART IDENTITY CASCADE;`;

  const now = new Date();
  const pastDate = new Date(now.setFullYear(now.getFullYear() - 1)); // A past date for the records

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

  const user3 = await prisma.user.create({
    data: {
      username: 'alice789',
      password: 'password789',
      name: 'Alice',
      image: null,
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  // Seed Gists with parentId null
  const gist1 = await prisma.gist.create({
    data: {
      title: 'First Gist',
      userId: user1.id,
      parentId: null, // No parent, it's a top-level gist
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist2 = await prisma.gist.create({
    data: {
      title: 'Second Gist',
      userId: user2.id,
      parentId: null, // No parent
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  const gist3 = await prisma.gist.create({
    data: {
      title: 'Third Gist',
      userId: user3.id,
      parentId: null, // No parent
      createdAt: pastDate,
      updatedAt: new Date(),
    },
  });

  // Helper function to create versions and edits for a gist
  async function createVersionsAndEdits(gistId, userId) {
    for (let i = 1; i <= 2; i++) {
      const version = await prisma.version.create({
        data: {
          point: `Version ${i} of Gist ${gistId}`,
          userId: userId,
          gistId: gistId,
          createdAt: pastDate,
          updatedAt: new Date(),
        },
      });

      for (let j = 1; j <= 2; j++) {
        await prisma.edit.create({
          data: {
            body: `Edit ${j} of Version ${i} of Gist ${gistId}`,
            userId: userId,
            versionId: version.id,
            createdAt: pastDate,
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  // Create versions and edits for each top-level gist
  await createVersionsAndEdits(gist1.id, user1.id);
  await createVersionsAndEdits(gist2.id, user2.id);
  await createVersionsAndEdits(gist3.id, user3.id);

  // Nested Gists for Gist 1 (5 nested levels)
  let parentGist = gist1;
  for (let i = 1; i <= 5; i++) {
    const nestedGist = await prisma.gist.create({
      data: {
        title: `Nested Gist Level ${i} for Gist 1`,
        userId: user2.id,
        parentId: parentGist.id, // Linking to the previous parent gist
        createdAt: pastDate,
        updatedAt: new Date(),
      },
    });

    await createVersionsAndEdits(nestedGist.id, user2.id);
    parentGist = nestedGist; // Set this as the parent for the next iteration
  }

  // Nested Gists for Gist 2 (4 nested levels)
  parentGist = gist2;
  for (let i = 1; i <= 4; i++) {
    const nestedGist = await prisma.gist.create({
      data: {
        title: `Nested Gist Level ${i} for Gist 2`,
        userId: user3.id,
        parentId: parentGist.id, // Linking to the previous parent gist
        createdAt: pastDate,
        updatedAt: new Date(),
      },
    });

    await createVersionsAndEdits(nestedGist.id, user3.id);
    parentGist = nestedGist; // Set this as the parent for the next iteration
  }

  // Nested Gists for Gist 3 (2 nested levels)
  parentGist = gist3;
  for (let i = 1; i <= 2; i++) {
    const nestedGist = await prisma.gist.create({
      data: {
        title: `Nested Gist Level ${i} for Gist 3`,
        userId: user1.id,
        parentId: parentGist.id, // Linking to the previous parent gist
        createdAt: pastDate,
        updatedAt: new Date(),
      },
    });

    await createVersionsAndEdits(nestedGist.id, user1.id);
    parentGist = nestedGist; // Set this as the parent for the next iteration
  }

  console.log('Nested gists, versions, and edits created successfully with 2 versions and 2 edits per version!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
