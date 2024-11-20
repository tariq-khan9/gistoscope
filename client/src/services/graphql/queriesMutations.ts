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
            image
          }
          newnessCount
          importantCount
          qualityCount
          flag
          comments {
            id
            comment
            parentId
            user {
              id
              name
            }
            createdAt
          }
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

export const GET_ALL_SUBJECTS = gql`
  query Subjects {
    subjects {
      id
      title
      parentId
    }
  }
`;

export const CREATE_SUBJECT = gql`
  mutation AddSubject($subject: AddSubjectInput) {
    addSubject(subject: $subject) {
      id
      title
      parentId
      userId
    }
  }
`;

export const UPDATE_SUBJECT = gql`
  mutation updateSubject($id: Int!, $subject: UpdateSubjectInput!) {
    updateSubject(id: $id, subject: $subject) {
      title
      parentId
    }
  }
`;

export const DELETE_SUBJECT = gql`
  mutation deleteSubject($id: Int!) {
    deleteSubject(id: $id) {
      id
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

export const CREATE_FAVORITE = gql`
  mutation addFavorite($fav: AddFavoriteInput) {
    addFavorite(fav: $fav) {
      userId
      editId
    }
  }
`;

export const GET_FAVORITE = gql`
  query Favorite($userId: Int!, $editId: Int!) {
    favorite(userId: $userId, editId: $editId) {
      id
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation addComment($newComment: AddCommentInput) {
    addComment(comment: $newComment) {
      comment
      parentId
      userId
      editId
    }
  }
`;

export const GET_COMMENT = gql`
  query comments($editId: Int!) {
    comments(editId: $editId) {
      id
      comment
      parentId
      user {
        id
        name
      }
      editId
      createdAt
    }
  }
`;
