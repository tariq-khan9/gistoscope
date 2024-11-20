import { DateTimeTypeDefinition } from "graphql-scalars";

export const User = `#graphql
${DateTimeTypeDefinition}
type User{
  id: Int!,
  email: String!,
  password: String,
  authType: String!,
  userType: String!,
  name: String!,
  image: String,
  createdAt: DateTime,
  updatedAt: DateTime,
  gists: [Gist],
  versions: [Version],
  edits: [Edit]
}
`;

export const Subject = `#graphql
${DateTimeTypeDefinition}
type Subject{
  id: Int!,
  title: String!,
  parentId: Int,
  userId: Int!,
  createdAt: DateTime,
  updatedAt: DateTime,
  user: User,
  gists: [Gist],
  subjects: [Subject]
}
`;

export const Gist = `#graphql
${DateTimeTypeDefinition}
type Gist{
    id: Int!,
    title: String!,
    parentId: Int,
    userId: Int!,
    user: User!,
    views: Int,
    subjectId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime,
    versions: [Version],
    gists: [Gist]
}
`;

export const Version = `#graphql
${DateTimeTypeDefinition}
type Version{
    id: Int!,
    point: String!,
    userId: Int!,
    user: User!,
    gistId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime,
    gist: Gist!
    edits: [Edit]
}
`;

export const Edit = `#graphql
${DateTimeTypeDefinition}
type Edit{
    id: Int!,
    body: String!,
    userId: Int!,
    user: User!,
    versionId: Int!,
    version: Version!,
    flag: Boolean,
    newnessCount:   Int,
    importantCount: Int,
    qualityCount:   Int,   
    comments: [Comment],
    createdAt: DateTime,
    updatedAt: DateTime
}
`;

export const UserEditAction = `#graphql
${DateTimeTypeDefinition}
type UserEditAction{
    id: Int!,
    userId: Int!,
    user: User!,
    editId: Int!,
    edit: Edit!,
    field: String!,
    actionType: String,
    createdAt: DateTime,
}
`;

export const Comment = `#graphql
${DateTimeTypeDefinition}
type Comment{
    id: Int!,
    comment: String!,
    parentId: Int,
    userId: Int!,
    user: User!,
    editId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime,
    edit: Edit!
}
`;

export const Favorite = `#graphql
type Favorite{
    id: Int!,
    userId: Int!,
    user: User!,
    editId: Int!,
    edit: Edit!
  
}
`;
