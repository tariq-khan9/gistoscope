import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const Mutation = {
  async addUser(_:any , args: any) {
    const user = await prisma.user.create({
      data: {
        username: args.user.username,
        password: args.user.password,
        name: args.user.name,
        image: args.user.image
      },
    });
    return user;
  },

  async updateUser(_:any , args: any) {
    const user = await prisma.user.update({
      where: { id: args.id },
      data: {
        username: args.user.username,
        password: args.user.password,
        name: args.user.name,
        image: args.user.image
      },
    });
    return user;
  },

  async deleteUser(_:any , args: any) {
    const user = await prisma.user.delete({
      where: { id: args.id },
    });
    return user;
  },

// ------//////////------   gist muations -------////////////----------

  async addGist(_:any , args: any) {
    const gist = await prisma.gist.create({
      data: {
         title: args.gist.title,
         parentId: args.gist.parentId,
         userId: args.gist.userId,
         views: 0

      },
    });
    return gist;
  },

  
  async deleteGist(_:any , args: any) {
    const gist = await prisma.gist.delete({
      where: { id: args.id },
    });
    return { message: "The Gist has been deleted", gist };
  },

//--------////////-------- Version mutations --------///////////------//////////

async addVersion(_:any , args: any) {
  const version = await prisma.version.create({
    data: {
      point: args.version.point,
      userId: args.version.userId,
      gistId: args.version.gistId

    },
  });
  return version;
},

//--------////////-------- Edit mutations --------///////////------//////////
  async addEdit(_:any , args: any) {
    const edit = await prisma.edit.create({
      data: {
        body: args.edit.body,
        userId: args.edit.userId,
        versionId: args.edit.versionId
      },
    });
    return edit;
  },

  async deleteEdit(_:any , args: any) {
    const edits = await prisma.edit.delete({
      where: { id: args.id },
    });
    return { message: "The edit has been deleted", edits };
  },

  async deleteVersion(_:any , args: any) {
    const version = await prisma.version.delete({
      where: { id: args.id },
    });
    return { message: "The edit has been deleted", version };
  },

};
