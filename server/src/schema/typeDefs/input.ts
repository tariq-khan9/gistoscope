import { DateTimeTypeDefinition } from "graphql-scalars";

export const AddUserInput = `#graphql
${DateTimeTypeDefinition}
input AddUserInput{
  email: String!,
  password: String,
  authType: String!,
  userType: String!,
  name: String!,
  image: String,
  createdAt: DateTime,
  updatedAt: DateTime

}
`;

export const UpdateUserInput = `#graphql
${DateTimeTypeDefinition}
input UpdateUserInput{
  email: String,
  password: String,
  name: String,
  image: String,
  createdAt: DateTime,
  updatedAt: DateTime
  
}
`;

export const AddSubjectInput = `#graphql
${DateTimeTypeDefinition}
input AddSubjectInput{
  title: String!,
  parentId: Int,
  userId: Int!,
  createdAt: DateTime,
  updatedAt: DateTime,
}
`;

export const UpdateSubjectInput = `#graphql
${DateTimeTypeDefinition}
input UpdateSubjectInput{
  title: String,
  parentId: Int,
  createdAt: DateTime,
  updatedAt: DateTime,
}
`;

export const AddGistInput = `#graphql
${DateTimeTypeDefinition}
input AddGistInput{
    title: String!,
    parentId: Int,
    userId: Int!,
    subjectId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime
  
  
}
`;

export const AddVersionInput = `#graphql
${DateTimeTypeDefinition}
input AddVersionInput{
    point: String!,
    userId: Int!,
    gistId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime
 
}
`;

export const AddEditInput = `#graphql
input AddEditInput{
    body: String!,
    userId: Int!,
    versionId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime

}

`;

export const UpdateEditInput = `#graphql
input UpdateEditInput{
    newnessCount:   Int,
    importantCount: Int,
    qualityCount:   Int,  
    flag: Boolean,
    updatedAt: DateTime
}

`;

export const AddUserEditActionInput = `#graphql
input AddUserEditActionInput{
    userId: Int!,
    editId: Int!,
    field: String!,
    actionType: String,
    createdAt: DateTime,
}
`;

export const AddCommentInput = `#graphql
input AddCommentInput{
    comment: String!,
    parentId: Int,
    userId: Int!,
    editId: Int!,
    createdAt: DateTime,
    updatedAt: DateTime

}
`;

export const AddFavoriteInput = `#graphql
input AddFavoriteInput{
    userId: Int!,
    editId: Int!,
}
`;
