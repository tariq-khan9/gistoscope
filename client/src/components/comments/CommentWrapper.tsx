import React, { useMemo, useState } from "react";
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
  const groupedComments = useMemo(
    () => groupCommentsByParent(comments),
    [comments]
  );
  //console.log("commengs are", comments);
  const sortedComments = useMemo(
    () => sortCommentsByCreatedAt(groupedComments),
    [groupedComments]
  );

  return (
    <>
      {sortedComments && sortedComments.length > 0 ? (
        sortedComments.map((comment, index) => (
          <Comments
            key={comment.id}
            comment={comment}
            userId={userId}
            editId={editId}
            handleRefetchComments={handleRefetchComments}
          />
        ))
      ) : (
        <div className="flex justify-center font-barlow text-gray-500">
          No comments exist
        </div>
      )}
    </>
  );
}
