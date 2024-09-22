import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const fieldResolvers = {
    User: {
        async gists(parent) {
            return await prisma.gist.findMany({
                where: { userId: parent.id },
            });
        },
    },
    Gist: {
        async versions(parent) {
            return await prisma.version.findMany({
                where: { gistId: parent.id },
            });
        },
        async gists(parent) {
            return await prisma.gist.findMany({
                where: {
                    parentId: parent.id
                }
            });
        }
    },
    Version: {
        async edits(parent) {
            return await prisma.edit.findMany({
                where: { versions: parent.id },
            });
        },
        async gist(parent) {
            return await prisma.gist.findUnique({
                where: { id: parent.gistId },
            });
        },
        async user(parent) {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
    },
    Edit: {
        async user(parent) {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
    },
};
