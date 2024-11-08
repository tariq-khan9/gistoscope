import { PrismaClient } from "@prisma/client";
import { Comment } from "../typeDefs/types";

const prisma = new PrismaClient();

export const fieldResolvers = {
  User: {
    async gists(parent: any) {
      return await prisma.gist.findMany({
        where: { userId: parent.id },
      });
    },
  },

  Gist: {
    async versions(parent: any) {
      return await prisma.version.findMany({
        where: { gistId: parent.id },
      });
    },

    async gists(parent: any) {
      return await prisma.gist.findMany({
        where: {
          parentId: parent.id,
        },
      });
    },
    async user(parent: any) {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },

  Version: {
    async edits(parent: any) {
      return await prisma.edit.findMany({
        where: { versionId: parent.id },
      });
    },
    async gist(parent: any) {
      return await prisma.gist.findUnique({
        where: { id: parent.gistId },
      });
    },
    async user(parent: any) {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },

  Edit: {
    async user(parent: any) {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },

    async comments(parent: any) {
      return await prisma.comment.findMany({
        where: { editId: parent.id },
      });
    },
  },

  Comment: {
    async user(parent: any) {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};
