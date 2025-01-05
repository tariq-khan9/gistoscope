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

  const handleToggleChildren = async () => {
    setChildrenShow((prev) => !prev);
    if (!childrenLoaded) {
      setLoading(true);

      // Simulate an async fetch for replies (if needed).
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulates a delay.

      setChildrenLoaded(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* <SingleComment
        comment={comment}
        userId={userId}
        editId={editId}
        setChildrenShow={setChildrenShow}
        childrenShow={childrenShow}
        handleRefetchComments={handleRefetchComments}
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col mt-4">
          <button
            onClick={handleToggleChildren}
            className="text-blue-500 hover:underline"
          >
            {childrenShow
              ? "Hide Replies"
              : loading
              ? "Loading..."
              : `Show Replies (${comment.replies.length})`}
          </button>

          {childrenShow && childrenLoaded && (
            <div className="ml-4 border-l pl-4">
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
      )} */}
    </div>
  );
}
