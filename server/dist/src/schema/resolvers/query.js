import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const Query = {
    users() {
        return prisma.user.findMany();
    },
    gists() {
        return prisma.gist.findMany();
    },
    rootGists() {
        return prisma.gist.findMany({
            where: {
                parentId: null
            }
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
    async gist(_, args) {
        return await prisma.gist.findUnique({
            where: { id: args.id },
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
};
