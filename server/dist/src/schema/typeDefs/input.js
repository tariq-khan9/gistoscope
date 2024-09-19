export const AddUserInput = `#graphql
input AddUserInput{
  username: String!,
  password: String!,
  name: String!,
  image: String,
}
`;
export const UpdateUserInput = `#graphql
input UpdateUserInput{
  username: String,
  password: String,
  name: String,
  image: String
  
}
`;
export const AddGistInput = `#graphql
input AddGistInput{
    title: String!,
    parentId: Int,
    userId: Int!,
  
}
`;
export const AddVersionInput = `#graphql
input AddVersionInput{
    point: String!,
    userId: Int!,
    gistId: Int!
}
`;
export const AddEditInput = `#graphql
input AddEditInput{
    body: String!,
    userId: Int!,
    versionId: Int!
}

`;
