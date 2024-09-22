import {User, Gist, Version, Edit} from "./types.js"
import { AddEditInput, UpdateUserInput, AddUserInput, AddGistInput, AddVersionInput } from "./input.js"


export const typeDefs = `#graphql
${User}
${Gist}
${Version}
${Edit}

${AddEditInput}
${UpdateUserInput}
${AddUserInput}

${AddGistInput}

${AddVersionInput}

type Query{
    users: [User]
    user(id: Int!): User

    gists: [Gist]
    rootGists: [Gist]
    gist(id: Int!): Gist

    versions: [Version]
    version(id: Int!): Version

    edits: [Edit]
    edit(id: Int!): Edit
}

type Mutation{
    addUser(user: AddUserInput): User
    updateUser(id: Int!, user: UpdateUserInput): User
    deleteUser(id: Int!): User

    addGist(gist: AddGistInput): Gist
    deleteGist(id: Int!): Gist

    addVersion(version: AddVersionInput): Version
    deleteVersion(id: Int!): Version

    addEdit(edit: AddEditInput): Edit
    deleteEdit(id: Int!): Edit

}



`