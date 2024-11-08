import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const Mutation = {
    async addUser(_, args) {
        const user = await prisma.user.create({
            data: {
                username: args.user.username,
                password: args.user.password,
                name: args.user.name,
                image: args.user.image,
            },
        });
        return user;
    },
    async updateUser(_, args) {
        const user = await prisma.user.update({
            where: { id: args.id },
            data: {
                username: args.user.username,
                password: args.user.password,
                name: args.user.name,
                image: args.user.image,
            },
        });
        return user;
    },
    async deleteUser(_, args) {
        const user = await prisma.user.delete({
            where: { id: args.id },
        });
        return user;
    },
    // ------//////////------   gist muations -------////////////----------
    async addGist(_, args) {
        const gist = await prisma.gist.create({
            data: {
                title: args.gist.title,
                subjectId: args.gist.subjectId,
                parentId: args.gist.parentId,
                userId: args.gist.userId,
                views: 0,
            },
        });
        return gist;
    },
    async deleteGist(_, args) {
        const gist = await prisma.gist.delete({
            where: { id: args.id },
        });
        return { message: "The Gist has been deleted", gist };
    },
    //--------////////-------- Version mutations --------///////////------//////////
    async addVersion(_, args) {
        const version = await prisma.version.create({
            data: {
                point: args.version.point,
                userId: args.version.userId,
                gistId: args.version.gistId,
            },
        });
        return version;
    },
    async deleteVersion(_, args) {
        const version = await prisma.version.delete({
            where: { id: args.id },
        });
        return { message: "The edit has been deleted", version };
    },
    //--------////////-------- Edit mutations --------///////////------//////////
    async addEdit(_, args) {
        const edit = await prisma.edit.create({
            data: {
                body: args.edit.body,
                userId: args.edit.userId,
                versionId: args.edit.versionId,
            },
        });
        return edit;
    },
    async updateEdit(_, args) {
        const edit = await prisma.edit.update({
            where: { id: args.id },
            data: {
                newnessCount: args.edit.newnessCount,
                importantCount: args.edit.importantCount,
                qualityCount: args.edit.qualityCount,
                flag: args.edit.flag,
            },
        });
        return edit;
    },
    async deleteEdit(_, args) {
        const edits = await prisma.edit.delete({
            where: { id: args.id },
        });
        return { message: "The edit has been deleted", edits };
    },
    //////////------------- other mutations ----------------------////////////////
    async addUserEditAction(_, args) {
        const action = await prisma.userEditAction.create({
            data: {
                userId: args.action.userId,
                editId: args.action.editId,
                field: args.action.field,
                actionType: args.action.actionType,
            },
        });
        return action;
    },
    async addFavorite(_, args) {
        const fav = await prisma.favorite.create({
            data: {
                userId: args.fav.userId,
                editId: args.fav.editId,
            },
        });
        return fav;
    },
    async addComment(_, args) {
        const newComment = await prisma.comment.create({
            data: {
                comment: args.comment.comment,
                parentId: args.comment.parentId,
                userId: args.comment.userId,
                editId: args.comment.editId,
            },
        });
        return newComment;
    },
};
