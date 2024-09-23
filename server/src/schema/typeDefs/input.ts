import {DateTimeTypeDefinition} from 'graphql-scalars'

export const AddUserInput = `#graphql
${DateTimeTypeDefinition}
input AddUserInput{
  username: String!,
  password: String!,
  name: String!,
  image: String,
  createdAt: DateTime,
  updatedAt: DateTime

}
`

export const UpdateUserInput = `#graphql
${DateTimeTypeDefinition}
input UpdateUserInput{
  username: String,
  password: String,
  name: String,
  image: String,
  createdAt: DateTime,
  updatedAt: DateTime
  
}
`
export const AddGistInput = `#graphql
${DateTimeTypeDefinition}
input AddGistInput{
    title: String!,
    parentId: Int,
    userId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime
  
  
}
`

export const AddVersionInput = `#graphql
${DateTimeTypeDefinition}
input AddVersionInput{
    point: String!,
    userId: Int!,
    gistId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime
 
}
`

export const AddEditInput = `#graphql
input AddEditInput{
    body: String!,
    userId: Int!,
    versionId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime

}

`