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

    console.log("Database reset successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
