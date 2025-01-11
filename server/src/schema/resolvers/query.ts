import { PrismaClient } from "@prisma/client";
import { Edit } from "../typeDefs/types";
import { subscribe } from "diagnostics_channel";

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

  async user(_: any, args: any) {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },

  async subject(_: any, args: any) {
    return await prisma.subject.findUnique({
      where: { id: args.id },
    });
  },

  async gist(_: any, args: any) {
    return await prisma.gist.findUnique({
      where: { id: args.id },
    });
  },

  async gistsBySubject(_: any, args: any) {
    return await prisma.gist.findMany({
      where: {
        subjectId: args.subjectId, // Condition for subjectId matching the argument
      },
    });
  },

  async version(_: any, args: any) {
    return await prisma.version.findUnique({
      where: { id: args.id },
    });
  },

  async edit(_: any, args: any) {
    return await prisma.edit.findUnique({
      where: { id: args.id },
    });
  },

  async favorite(_: any, args: any) {
    return await prisma.favorite.findFirst({
      where: {
        userId: args.userId,
        editId: args.editId,
      },
    });
  },

  async comments(_: any, args: any) {
    return await prisma.comment.findMany({
      where: { editId: args.editId },
    });
  },
};
