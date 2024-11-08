import React, { useState } from "react";
import { CommentType } from "../../services/types";
import Comments from "./Comments";
import { groupCommentsByParent } from "../../services/utils/groupCommentsByParent";
import { sortCommentsByCreatedAt } from "../../services/utils/sortCommentsByTime";

interface Props {
  userId: number;
  editId: number;
  comments: CommentType[];
  handleRefetchComments: () => void;
}

export default function CommentWrapper({
  comments,
  userId,
  editId,
  handleRefetchComments,
}: Props) {
  const groupedComments = groupCommentsByParent(comments);

  const sortedComments = sortCommentsByCreatedAt(groupedComments);

  return (
    <>
      {sortedComments && sortedComments.length > 0 ? (
        sortedComments.map((comment, index) => (
          <Comments
            key={index}
            comment={comment}
            userId={userId}
            editId={editId}
            handleRefetchComments={handleRefetchComments}
          />
        ))
      ) : (
        <div>No comments exist</div>
      )}
    </>
  );
}
