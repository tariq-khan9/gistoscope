import { CommentType } from "../../services/types";
import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

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
  const children = comment.replies;

  useEffect(() => {}, [children]);

  return (
    <div className="flex flex-col">
      <SingleComment
        comment={comment}
        userId={userId}
        editId={editId}
        setChildrenShow={setChildrenShow}
        childrenShow={childrenShow}
        handleRefetchComments={handleRefetchComments}
      />

      {children && children.length > 0 && (
        <div
          className={`flex flex-row w-full justify-between ${
            childrenShow ? "flex" : "hidden"
          }`}
        >
          <button
            onClick={() => setChildrenShow(!childrenShow)}
            className={`mt-4 border-l-[2px] hover:border-gray-500 border-gray-300`}
            aria-label="Hide Replies"
          />
          <div className="w-full ml-4">
            {children.map((childComment) => (
              <Comment
                key={childComment.id}
                comment={childComment}
                userId={userId}
                editId={editId}
                handleRefetchComments={handleRefetchComments}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
