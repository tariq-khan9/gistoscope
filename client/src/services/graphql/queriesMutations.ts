import { gql } from "@apollo/client";

export const GET_ALL_GISTS = gql`
  query GetGists {
    gists {
      id
      title
      parentId
      createdAt
      versions {
        id
        point
        gistId
        user {
          name
        }
        createdAt
        edits {
          id
          body
          versionId
          user {
            id
            name
          }
          newnessCount
          importantCount
          qualityCount
          flag
          createdAt
        }
      }
    }
  }
`;

export const CREATE_GIST = gql`
  mutation AddGist($gist: AddGistInput) {
    addGist(gist: $gist) {
      id
    }
  }
`;

export const DELETE_GIST = gql`
  mutation deleteGist($id: Int!) {
    deleteGist(id: $id) {
      id
      title
    }
  }
`;

export const CREATE_VERSION = gql`
  mutation AddVersion($version: AddVersionInput) {
    addVersion(version: $version) {
      id
    }
  }
`;

export const DELETE_VERSION = gql`
  mutation deleteVersion($id: Int!) {
    deleteVersion(id: $id) {
      id
    }
  }
`;

export const CREATE_EDIT = gql`
  mutation addEdit($edit: AddEditInput) {
    addEdit(edit: $edit) {
      body
      id
    }
  }
`;

export const UPDATE_EDIT = gql`
  mutation updateEdit($id: Int!, $edit: UpdateEditInput!) {
    updateEdit(id: $id, edit: $edit) {
      flag
      newnessCount
      importantCount
      qualityCount
    }
  }
`;

export const CREATE_ACTION = gql`
  mutation addUserEditAction($action: AddUserEditActionInput) {
    addUserEditAction(action: $action) {
      userId
      editId
      field
      actionType
    }
  }
`;
