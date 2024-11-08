import { CommentType } from "../types";

export function sortCommentsByCreatedAt(
  comments: CommentType[]
): CommentType[] {
  // Sort the main array by createdAt
  comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Recursively sort replies within each comment
  comments.forEach((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      sortCommentsByCreatedAt(comment.replies);
    }
  });

  return comments;
}
