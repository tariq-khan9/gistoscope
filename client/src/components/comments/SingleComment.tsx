import React, { useEffect, useRef, useState } from "react";
import { CommentType } from "../../services/types";
import { IoSend } from "react-icons/io5";
import { CREATE_COMMENT } from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import { CgMailReply } from "react-icons/cg";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

interface Props {
  setChildrenShow: React.Dispatch<React.SetStateAction<boolean>>;
  childrenShow: boolean;
  comment: CommentType;
  userId: number;
  editId: number;
  handleRefetchComments: () => void;
}

export default function SingleComment({
  setChildrenShow,
  childrenShow,
  comment,
  userId,
  editId,
  handleRefetchComments,
}: Props) {
  const [createComment] = useMutation(CREATE_COMMENT);

  const [content, setContent] = useState("");
  const [showReply, setShowReply] = useState(false); // Dummy state to force rerenders

  const handleClick = async () => {
    if (content === "") return;
    try {
      const { data } = await createComment({
        variables: {
          newComment: {
            comment: content,
            parentId: comment.id,
            userId: userId,
            editId: editId,
          },
        },
      });

      // Add the new comment to the top-level component's state
      handleRefetchComments();

      setContent("");
      setShowReply(false);
      setChildrenShow(true);
    } catch (error) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <div className="border border-gray-400 p-4 flex flex-col mt-4 rounded-md bg-slate-100">
        <div className="top-row  flex flex-row justify-between text-[12px] border-b border-gray-300">
          <h1 className="text-[13px] font-bold text-blue-600">
            {comment.user.name}
          </h1>
          <h1>{dateFormatter.format(Date.parse(comment.createdAt))}</h1>
        </div>

        <div className="text-[16px] mt-6">{comment.comment}</div>

        <div className="flex flex-row justify-between items-center mt-4">
          <div className="flex flex-row">
            <div className="text-[10px] text-gray-500">
              {/* <span>Likes: </span><span>{comment.sentiments.length}</span> */}
              <span className="ml-4">Dislike: </span>
              <span>0</span>
            </div>
          </div>
          <div className="text-[11px] flex flex-row items-center space-x-2">
            <button
              className=" flex flex-row items-center"
              onClick={() => setShowReply(!showReply)}
            >
              <CgMailReply size={20} className="text-gray-500 mx-[2px]" />
              Reply
            </button>
            <button
              className="hover:text-blue-700"
              onClick={() => setChildrenShow(!childrenShow)}
            >
              Comments:{" "}
            </button>
            <span>{comment.replies.length}</span>
          </div>
        </div>
      </div>
      {/* ---------------- reply section starts here --------------------------*/}
      {showReply && (
        <div className="reply mt-2 ">
          <div className="relative w-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className=" p-1 px-2 border border-slate-600 w-full rounded-md text-[13px] pr-10" // Add padding to the right for the icon
              rows={2}
            />
            <IoSend
              onClick={handleClick}
              className="absolute right-4 top-[25px] transform -translate-y-1/2 text-slate-700 hover:text-amber-600 text-[20px] cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
}
