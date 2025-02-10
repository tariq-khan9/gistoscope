import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const Query = {
    users() {
        return prisma.user.findMany();
    },
    subjects() {
        return prisma.subject.findMany();
    },
    gists() {
        return prisma.gist.findMany();
    },
    rootGists() {
        return prisma.gist.findMany({
            where: {
                parentId: null,
            },
        });
    },
    versions() {
        return prisma.version.findMany();
    },
    edits() {
        return prisma.edit.findMany();
    },
    async user(_, args) {
        return await prisma.user.findUnique({
            where: { id: args.id },
        });
    },
    async subject(_, args) {
        return await prisma.subject.findUnique({
            where: { id: args.id },
        });
    },
    async gist(_, args) {
        return await prisma.gist.findUnique({
            where: { id: args.id },
        });
    },
    async gistsBySubject(_, args) {
        return await prisma.gist.findMany({
            where: {
                subjectId: args.subjectId, // Condition for subjectId matching the argument
            },
        });
    },
    async gistsByUser(_, args) {
        return await prisma.gist.findMany({
            where: {
                userId: args.userId, // Condition for subjectId matching the argument
            },
        });
    },
    async version(_, args) {
        return await prisma.version.findUnique({
            where: { id: args.id },
        });
    },
    async edit(_, args) {
        return await prisma.edit.findUnique({
            where: { id: args.id },
        });
    },
    async favorite(_, args) {
        return await prisma.favorite.findFirst({
            where: {
                userId: args.userId,
                editId: args.editId,
            },
        });
    },
    async comments(_, args) {
        return await prisma.comment.findMany({
            where: { editId: args.editId },
        });
    },
};
