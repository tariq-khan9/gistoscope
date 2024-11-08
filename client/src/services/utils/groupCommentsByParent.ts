import { CommentType } from "../types";

export function groupCommentsByParent(comments: CommentType[]) {
  // Create a map where each comment's id is a key for quick access
  const commentsById = comments.reduce((map: any, comment: CommentType) => {
    map[comment.id] = { ...comment, replies: [] }; // Use 'replies' to store nested comments
    return map;
  }, {});

  // Initialize an array to hold the top-level (root) comments
  const rootComments: CommentType[] = [];

  // Loop through the comments and place each one in the appropriate position
  comments.forEach((comment: CommentType) => {
    if (comment.parentId === null) {
      // Top-level comment (no parent), so add it to the root array
      rootComments.push(commentsById[comment.id]);
    } else if (commentsById[comment.parentId]) {
      // Add comment to its parent's 'replies' array
      commentsById[comment.parentId].replies.push(commentsById[comment.id]);
    }
  });

  return rootComments;
}
