import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // Delete all records from the database in reverse order of dependencies
    await prisma.commentLike.deleteMany();
    await prisma.userEditAction.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.edit.deleteMany();
    await prisma.version.deleteMany();
    await prisma.gist.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.user.deleteMany();

    // Reset sequence of IDs for PostgreSQL
    const sequences = [
      "User",
      "Gist",
      "Version",
      "Edit",
      "Comment",
      "Favorite",
      "UserEditAction",
      "Subject",
      "CommentLike",
    ];
    for (const seq of sequences) {
      await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "${seq}_id_seq" RESTART WITH 1`
      );
    }

    // Create users
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        isEmailVerified: false,
        authType: "local",
        password: "adminpassword",
        name: "Admin User",
        userType: "admin",
        image: null,
      },
    });

    const member1 = await prisma.user.create({
      data: {
        email: "member1@example.com",
        isEmailVerified: false,
        authType: "local",
        password: "memberpassword1",
        name: "Member One",
        userType: "member",
        image: null,
      },
    });

    const member2 = await prisma.user.create({
      data: {
        email: "member2@example.com",
        isEmailVerified: false,
        authType: "local",
        password: "memberpassword2",
        name: "Member Two",
        userType: "member",
        image: null,
      },
    });

    // Create top-level subjects
    const topSubjects = await Promise.all(
      ["Subject 1", "Subject 2", "Subject 3"].map((title) =>
        prisma.subject.create({
          data: { title, userId: admin.id },
        })
      )
    );

    // Create sub-subjects for each top-level subject
    for (const topSubject of topSubjects) {
      const subSubjects = await Promise.all(
        ["Sub 1", "Sub 2", "Sub 3"].map((subTitle) =>
          prisma.subject.create({
            data: {
              title: `${topSubject.title} - ${subTitle}`,
              parentId: topSubject.id,
              userId: admin.id,
            },
          })
        )
      );

      // Create sub-sub-subjects for each sub-subject
      for (const subSubject of subSubjects) {
        await Promise.all(
          ["Sub-Sub 1", "Sub-Sub 2"].map((subSubTitle) =>
            prisma.subject.create({
              data: {
                title: `${subSubject.title} - ${subSubTitle}`,
                parentId: subSubject.id,
                userId: admin.id,
              },
            })
          )
        );
      }
    }

    // Create Gists, Versions, and Edits
    for (const [gistIndex, gistTitle] of [
      "First Gist",
      "Second Gist",
      "Third Gist",
    ].entries()) {
      const gist = await prisma.gist.create({
        data: {
          title: gistTitle,
          userId: admin.id,
          subjectId: topSubjects[gistIndex % topSubjects.length].id, // Assign a subject cyclically
        },
      });

      for (let versionIndex = 1; versionIndex <= 3; versionIndex++) {
        const version = await prisma.version.create({
          data: {
            point: `${gistTitle} Version ${versionIndex}`,
            gistId: gist.id,
            userId: admin.id,
          },
        });

        for (let editIndex = 1; editIndex <= 2; editIndex++) {
          await prisma.edit.create({
            data: {
              body: `${gistTitle} Version ${versionIndex} Edit ${editIndex}`,
              versionId: version.id,
              userId: admin.id,
              flag: false,
              newnessCount: 0,
              importantCount: 0,
              qualityCount: 0,
            },
          });
        }
      }
    }

    console.log("Database reset and seeded successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
