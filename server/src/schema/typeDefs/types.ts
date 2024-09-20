
import {DateTimeTypeDefinition} from 'graphql-scalars'

export const User = `#graphql
${DateTimeTypeDefinition}
type User{
  id: Int!,
  username: String!,
  password: String!,
  name: String!,
  image: String,
  createdAt: DateTime!,
  updatedAt: DateTime,
  gists: [Gist],
  versions: [Version],
  edits: [Edit]
}
`
export const Gist = `#graphql
${DateTimeTypeDefinition}
type Gist{
    id: Int!,
    title: String!,
    parentId: Int,
    userId: Int!,
    user: User!,
    createdAt: DateTime!,
    updatedAt: DateTime,
    versions: [Version],
    gists: [Gist]
}
`

export const Version = `#graphql
${DateTimeTypeDefinition}
type Version{
    id: Int!,
    point: String!,
    userId: Int!,
    user: User!,
    gistId: Int!,
    createdAt: DateTime!,
    updatedAt: DateTime,
    gist: Gist!
    edits: [Edit]
}
`

export const Edit = `#graphql
${DateTimeTypeDefinition}
type Edit{
    id: Int!,
    body: String!,
    userId: Int!,
    createdAt: DateTime!,
    updatedAt: DateTime,
    user: User!,
    versionId: Int!
    version: Version!
}
`




