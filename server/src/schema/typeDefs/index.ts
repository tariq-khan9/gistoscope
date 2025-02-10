import {
  User,
  Subject,
  Gist,
  Version,
  Edit,
  UserEditAction,
  Favorite,
  Comment,
} from "./types.js";
import {
  AddEditInput,
  UpdateEditInput,
  AddUserEditActionInput,
  UpdateUserInput,
  AddUserInput,
  AddSubjectInput,
  UpdateSubjectInput,
  AddGistInput,
  AddVersionInput,
  AddFavoriteInput,
  AddCommentInput,
} from "./input.js";

export const typeDefs = `#graphql
${User}
${Subject}
${Gist}
${Version}
${Edit}
${Favorite}
${Comment}
${UserEditAction}

${AddEditInput}
${UpdateEditInput}
${AddUserEditActionInput}
${UpdateUserInput}
${AddUserInput}

${AddSubjectInput}
${UpdateSubjectInput}

${AddGistInput}

${AddVersionInput}

${AddFavoriteInput}

${AddCommentInput}



type Query{
    users: [User]
    user(id: Int!): User

    subjects: [Subject]
    subject: Subject

    gists: [Gist]
    rootGists: [Gist]
    gistsBySubject(subjectId: Int!): [Gist]
    gistsByUser(userId: Int!): [Gist]
    gist(id: Int!): Gist

    versions: [Version]
    version(id: Int!): Version

    edits: [Edit]
    edit(id: Int!): Edit

    favorite(userId: Int!, editId: Int!): Favorite
    comments(editId: Int!): [Comment]
}

type Mutation{
    addUser(user: AddUserInput): User
    updateUser(id: Int!, user: UpdateUserInput): User
    deleteUser(id: Int!): User

    addSubject(subject: AddSubjectInput): Subject
    updateSubject(id: Int!, subject: UpdateSubjectInput): Subject
    deleteSubject(id: Int!): Subject

    addGist(gist: AddGistInput): Gist
    deleteGist(id: Int!): Gist

    addVersion(version: AddVersionInput): Version
    deleteVersion(id: Int!): Version

    addEdit(edit: AddEditInput): Edit
    updateEdit(id: Int!, edit: UpdateEditInput): Edit
    deleteEdit(id: Int!): Edit

    addUserEditAction(action: AddUserEditActionInput): UserEditAction

    addFavorite(fav: AddFavoriteInput): Favorite

    addComment(comment: AddCommentInput): Comment

}
`;
