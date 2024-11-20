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
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Gist_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Version_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Edit_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Favorite_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "UserEditAction_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Subject_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "CommentLike_id_seq" RESTART WITH 1`;

    // Create users
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
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

    // The remaining part of the seed logic stays the same
    const gist = await prisma.gist.create({
      data: {
        title: "Sample Gist",
        userId: admin.id,
        subjectId: topSubjects[0].id,
      },
    });

    const version = await prisma.version.create({
      data: {
        point: "Initial version point",
        gistId: gist.id,
        userId: admin.id,
      },
    });

    const edit1 = await prisma.edit.create({
      data: {
        body: "First edit for the version",
        versionId: version.id,
        userId: admin.id,
        flag: false,
        newnessCount: 2,
        importantCount: 3,
        qualityCount: 4,
      },
    });

    const edit2 = await prisma.edit.create({
      data: {
        body: "Second edit for the version",
        versionId: version.id,
        userId: admin.id,
        flag: true,
        newnessCount: 1,
        importantCount: 2,
        qualityCount: 3,
      },
    });

    const action1 = await prisma.userEditAction.create({
      data: {
        userId: member1.id,
        editId: edit1.id,
        field: "qualityCount",
        actionType: "increment",
      },
    });

    const action2 = await prisma.userEditAction.create({
      data: {
        userId: member2.id,
        editId: edit2.id,
        field: "importantCount",
        actionType: "increment",
      },
    });

    const favorite = await prisma.favorite.create({
      data: {
        userId: member1.id,
        editId: edit1.id,
      },
    });

    const comment1 = await prisma.comment.create({
      data: {
        comment: "This is a comment on the first edit.",
        userId: member1.id,
        editId: edit1.id,
      },
    });

    const comment2 = await prisma.comment.create({
      data: {
        comment: "Another comment on the first edit.",
        userId: member2.id,
        editId: edit1.id,
      },
    });

    const commentLike = await prisma.commentLike.create({
      data: {
        userId: member1.id,
        commentId: comment1.id,
      },
    });

    console.log("Database reset and seeded successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
