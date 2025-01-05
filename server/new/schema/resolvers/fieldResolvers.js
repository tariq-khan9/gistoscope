import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const fieldResolvers = {
    User: {
        async gists(parent) {
            return await prisma.gist.findMany({
                where: { userId: parent.id },
            });
        },
    },
    Subject: {
        async gists(parent) {
            return await prisma.gist.findMany({
                where: { userId: parent.id },
            });
        },
        async user(parent) {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
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
                    parentId: parent.id,
                },
            });
        },
        async user(parent) {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
    },
    Version: {
        async edits(parent) {
            return await prisma.edit.findMany({
                where: { versionId: parent.id },
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
        async comments(parent) {
            return await prisma.comment.findMany({
                where: { editId: parent.id },
            });
        },
    },
    Comment: {
        async user(parent) {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
    },
};
