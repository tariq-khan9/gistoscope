import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const Query = {
  users() {
    return prisma.user.findMany();
  },
  
  gists() {
    return prisma.gist.findMany();
  },

  versions() {
    return prisma.version.findMany();
  },

  edits() {
    return prisma.edit.findMany();
  },

  async user(_:any , args: any) {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },

  async gist(_:any , args: any) {
    return await prisma.gist.findUnique({
      where: { id: args.id },
    });
  },

  async version(_:any , args: any) {
    return await prisma.version.findUnique({
      where: { id: args.id },
    });
  },

  async edit(_:any , args: any) {
    return await prisma.edit.findUnique({
      where: { id: args.id },
    });
  },
};
