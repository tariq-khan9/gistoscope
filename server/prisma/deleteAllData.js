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

    // Create a user
    const user = await prisma.user.create({
      data: {
        email: "tariq",
        authType: "local",
        password: "password123",
        name: "tariq khan",
        image: null, // Optional
      },
    });

    // Create a subject associated with the user
    const subject = await prisma.subject.create({
      data: {
        title: "Sample Subject",
        userId: user.id,
      },
    });

    // Create a gist associated with the subject and user
    const gist = await prisma.gist.create({
      data: {
        title: "Sample Gist",
        userId: user.id,
        subjectId: subject.id,
      },
    });

    // Create a version associated with the gist and user
    const version = await prisma.version.create({
      data: {
        point: "Initial version point",
        gistId: gist.id,
        userId: user.id,
      },
    });

    // Create two edits for the version
    const edit1 = await prisma.edit.create({
      data: {
        body: "First edit for the version",
        versionId: version.id,
        userId: user.id,
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
        userId: user.id,
        flag: true,
        newnessCount: 1,
        importantCount: 2,
        qualityCount: 3,
      },
    });

    // Add user actions on edits
    const action1 = await prisma.userEditAction.create({
      data: {
        userId: user.id,
        editId: edit1.id,
        field: "qualityCount",
        actionType: "increment",
      },
    });

    const action2 = await prisma.userEditAction.create({
      data: {
        userId: user.id,
        editId: edit2.id,
        field: "importantCount",
        actionType: "increment",
      },
    });

    // Add a favorite for an edit
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        editId: edit1.id,
      },
    });

    // Add comments on an edit
    const comment1 = await prisma.comment.create({
      data: {
        comment: "This is a comment on the first edit.",
        userId: user.id,
        editId: edit1.id,
      },
    });

    const comment2 = await prisma.comment.create({
      data: {
        comment: "Another comment on the first edit.",
        userId: user.id,
        editId: edit1.id,
      },
    });

    // Add likes on comments
    const commentLike = await prisma.commentLike.create({
      data: {
        userId: user.id,
        commentId: comment1.id,
      },
    });

    console.log(
      "Database reset and seeded with user, subject, gist, version, edits, actions, comments, favorites, and comment likes:",
      {
        user,
        subject,
        gist,
        version,
        edits: [edit1, edit2],
        actions: [action1, action2],
        favorites: [favorite],
        comments: [comment1, comment2],
        commentLikes: [commentLike],
      }
    );
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
