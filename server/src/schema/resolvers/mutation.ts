import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Mutation = {
  async addUser(_: any, args: any) {
    const user = await prisma.user.create({
      data: {
        email: args.user.email,
        userType: args.user.userType,
        authType: args.user.authType,
        password: args.user.password,
        name: args.user.name,
        image: args.user.image,
      },
    });
    return user;
  },

  async updateUser(_: any, args: any) {
    const user = await prisma.user.update({
      where: { id: args.id },
      data: {
        email: args.user.email,
        password: args.user.password,
        name: args.user.name,
        image: args.user.image,
      },
    });
    return user;
  },

  async deleteUser(_: any, args: any) {
    const user = await prisma.user.delete({
      where: { id: args.id },
    });
    return user;
  },

  // ------//////////------   subject muations -------////////////----------

  async addSubject(_: any, args: any) {
    const subject = await prisma.subject.create({
      data: {
        title: args.subject.title,
        parentId: args.subject.parentId,
        userId: args.subject.userId,
      },
    });
    return subject;
  },

  async updateSubject(_: any, args: any) {
    const subject = await prisma.subject.update({
      where: { id: args.id },
      data: {
        title: args.subject.title,
        parentId: args.subject.parentId,
      },
    });
    return subject;
  },

  // ------//////////------   gist muations -------////////////----------

  async addGist(_: any, args: any) {
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

  async deleteGist(_: any, args: any) {
    const gist = await prisma.gist.delete({
      where: { id: args.id },
    });
    return { message: "The Gist has been deleted", gist };
  },

  //--------////////-------- Version mutations --------///////////------//////////

  async addVersion(_: any, args: any) {
    const version = await prisma.version.create({
      data: {
        point: args.version.point,
        userId: args.version.userId,
        gistId: args.version.gistId,
      },
    });
    return version;
  },

  async deleteVersion(_: any, args: any) {
    const version = await prisma.version.delete({
      where: { id: args.id },
    });
    return { message: "The edit has been deleted", version };
  },

  //--------////////-------- Edit mutations --------///////////------//////////
  async addEdit(_: any, args: any) {
    const edit = await prisma.edit.create({
      data: {
        body: args.edit.body,
        userId: args.edit.userId,
        versionId: args.edit.versionId,
      },
    });
    return edit;
  },

  async updateEdit(_: any, args: any) {
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

  async deleteEdit(_: any, args: any) {
    const edits = await prisma.edit.delete({
      where: { id: args.id },
    });
    return { message: "The edit has been deleted", edits };
  },

  //////////------------- other mutations ----------------------////////////////
  async addUserEditAction(_: any, args: any) {
    const action = await prisma.userEditAction.create({
      data: {
        userId: args.action.userId!,
        editId: args.action.editId!,
        field: args.action.field!,
        actionType: args.action.actionType,
      },
    });
    return action;
  },

  async addFavorite(_: any, args: any) {
    const fav = await prisma.favorite.create({
      data: {
        userId: args.fav.userId!,
        editId: args.fav.editId!,
      },
    });
    return fav;
  },

  async addComment(_: any, args: any) {
    const newComment = await prisma.comment.create({
      data: {
        comment: args.comment.comment,
        parentId: args.comment.parentId,
        userId: args.comment.userId!,
        editId: args.comment.editId!,
      },
    });
    return newComment;
  },
};
