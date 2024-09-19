export const User = `#graphql
type User{
  id: Int!,
  username: String!,
  password: String!,
  name: String!,
  image: String,
  gists: [Gist],
  versions: [Version],
  edits: [Edit]
}
`;
export const Gist = `#graphql
type Gist{
    id: Int!,
    title: String!,
    parentId: Int,
    userId: Int!,
    user: User!,
    versions: [Version]
}
`;
export const Version = `#graphql
type Version{
    id: Int!,
    point: String!,
    userId: Int!,
    user: User!,
    gistId: Int!,
    gist: Gist!
    edits: [Edit]
}
`;
export const Edit = `#graphql
type Edit{
    id: Int!,
    body: String!,
    userId: Int!,
    user: User!,
    versionId: Int!
    version: Version!
}
`;
