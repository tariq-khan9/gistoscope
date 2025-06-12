import React, { useState, useEffect, useRef } from "react";
import { CommentType } from "../../services/types";
import { IoSend } from "react-icons/io5";
import { CREATE_COMMENT } from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import { CgMailReply } from "react-icons/cg";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const CommentCard = ({
  comment,
  userId,
  editId,
  replies,
  handleRefetchComments,
  onClick,
  onDoubleClick,
  isExpanded,
  isFullSize,
  isFocused,
}: {
  comment: CommentType;
  userId: number;
  editId: number;
  replies: number;
  handleRefetchComments: () => void;
  onClick: () => void;
  onDoubleClick: () => void;
  isExpanded: boolean;
  isFullSize: boolean;
  isFocused: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [createComment] = useMutation(CREATE_COMMENT);
  console.log("comment in card ", comment);
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

      handleRefetchComments();

      setContent("");
      setShowReply(false);
      // setChildrenShow(true);
    } catch (error) {}
  };

  // const handleToggleChildren = async () => {
  //   setChildrenShow((prev) => !prev);
  //   if (!childrenLoaded) {
  //     await new Promise((resolve) => setTimeout(resolve, 500)); // Simulates a delay.

  //     setChildrenLoaded(true);
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };
  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isFocused]);

  return (
    <div
      ref={cardRef}
      className={`
        mx-2 my-1 p-3 
        ${
          isFullSize
            ? "w-[400px] min-h-[200px]" // Wider than tall (2:1 ratio)
            : "w-[180px] md:w-[220px] lg:w-[250px] min-h-[80px]"
        } 
        border rounded-lg shadow-sm 
        cursor-pointer transition-all duration-200
        flex flex-col justify-between
        ${
          isExpanded
            ? "bg-blue-50 border-blue-300"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
        ${isFocused ? "ring-2 ring-blue-500" : ""}
      `}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex flex-col h-full">
        <div className="top-row  flex flex-row justify-between text-[9px] sm:text-[12px] border-b border-gray-300">
          <h1 className="text-[10px] sm:text-[13px]  text-blue-600">
            {comment.user.name}
          </h1>
          <h1 className="font-light">
            {dateFormatter.format(Date.parse(comment.createdAt))}
          </h1>
        </div>

        <div className="flex-1 text-left font-quicksand mt-1 sm:mt-2 text-[11px] sm:text-[14px] lg:text-[16px]">
          {comment.comment}
        </div>

        <div className="flex flex-row justify-between items-center mt-auto sm:mt-4">
          <div className="flex flex-row">
            <div className="text-[10px] text-gray-500">
              {/* <span>Likes: </span><span>{comment.sentiments.length}</span> */}
              <span className=" text-[10px] sm:text-[12px]">Likes: </span>
              <span>0</span>
            </div>
          </div>
          <div className="text-[9px] sm:text-[11px] flex flex-row items-center space-x-1 sm:space-x-2">
            {isFullSize && (
              <button
                className=" flex flex-row items-center"
                onClick={() => setShowReply(!showReply)}
              >
                <CgMailReply size={20} className="text-gray-500 mx-[2px]" />
                Reply
              </button>
            )}

            <button
              className="font-normal text-gray-500"
              // onClick={() => {
              //   handleToggleChildren();
              // }}
            >
              Comments:{" "}
            </button>
            <span>{replies}</span>
          </div>
        </div>
      </div>
      {/* ---------------- reply section starts here --------------------------*/}
      {showReply && isFullSize && (
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
    </div>
  );
};

export default CommentCard;
