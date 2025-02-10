import React, { useState } from "react";
import SingleComment from "./SingleComment";
import { CommentType } from "../../services/types";

interface Props {
  comment: CommentType;
  userId: number;
  editId: number;
  handleRefetchComments: () => void;
}

export default function Comment({
  comment,
  userId,
  editId,
  handleRefetchComments,
}: Props) {
  const [childrenShow, setChildrenShow] = useState(false);
  const [childrenLoaded, setChildrenLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col">
      <SingleComment
        comment={comment}
        userId={userId}
        editId={editId}
        setChildrenShow={setChildrenShow}
        childrenShow={childrenShow}
        childrenLoaded={childrenLoaded}
        setChildrenLoaded={setChildrenLoaded}
        handleRefetchComments={handleRefetchComments}
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col mt-2 mb-2 sm:mt-4 sm:mb-4">
          {childrenShow && childrenLoaded && (
            <div className=" border-l pl-1 sm:pl-2 md:pl-4">
              {comment.replies.map((childComment) => (
                <Comment
                  key={childComment.id}
                  comment={childComment}
                  userId={userId}
                  editId={editId}
                  handleRefetchComments={handleRefetchComments}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
