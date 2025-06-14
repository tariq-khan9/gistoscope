import React, { useState, useEffect, useRef } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { CommentType } from "../../services/types";

import { IoSend } from "react-icons/io5";
import { CREATE_COMMENT } from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import { CgMailReply } from "react-icons/cg";
import { useGlobalContext } from "../context/AuthContext";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const CommentCard = ({
  comment,

  editId,
  replies,
  handleRefetchComments,
  toggleComment,
  toggleFullSize,
  isExpanded,
  isFullSize,
  isFocused,
  scrollTrigger,
}: {
  comment: CommentType;
  editId: number;
  replies: number;
  handleRefetchComments: () => void;
  toggleComment: () => void;
  toggleFullSize: () => void;
  isExpanded: boolean;
  isFullSize: boolean;
  isFocused: boolean;
  scrollTrigger: number;
}) => {
  const { user } = useGlobalContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [createComment] = useMutation(CREATE_COMMENT);
  console.log("comment in card ", comment);
  const [content, setContent] = useState("");
  const [showReply, setShowReply] = useState(false); // Dummy state to force rerenders
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleClick = async () => {
    if (content === "") return;
    try {
      const { data } = await createComment({
        variables: {
          newComment: {
            comment: content,
            parentId: comment.id,
            userId: user?.id,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [scrollTrigger]);

  return (
    <div
      ref={cardRef}
      className={`
        mx-2 my-1 p-3 
        ${
          isFullSize
            ? "w-[300px] sm:w-[600px] min-h-[200px]" // Wider than tall (2:1 ratio)
            : "w-[200px] md:w-[300px] lg:w-[400px] min-h-[100px] md:min-h-[140px]"
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
      onClick={toggleFullSize}
      //onDoubleClick={onDoubleClick}
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

        <div className="flex-1 whitespace-pre-wrap text-left font-quicksand mt-1 sm:mt-2 text-[11px] sm:text-[14px] lg:text-[16px]">
          {isFullSize
            ? comment.comment
            : (() => {
                const normalized = comment.comment.replace(/\n+/g, " ").trim();
                return normalized.length > 120
                  ? normalized.slice(0, 120) + "..."
                  : normalized;
              })()}
        </div>

        <div className="flex flex-row justify-between items-center mt-auto sm:mt-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="text-[10px] text-gray-500">
              {/* <span>Likes: </span><span>{comment.sentiments.length}</span> */}
              <span className=" text-[10px] sm:text-[12px]">Likes: </span>
              <span>0</span>
            </div>
          </div>
          <div className="text-[9px] sm:text-[11px] flex flex-row items-center space-x-1 sm:space-x-2">
            {isFullSize && (
              <button
                disabled={!user ? true : false}
                className=" flex flex-row items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReply(!showReply);
                }}
              >
                <CgMailReply size={20} className="text-gray-500 mx-[2px]" />
                Reply
              </button>
            )}

            <button
              className="font-normal text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                toggleComment();
              }}
            >
              Comments:{" "}
            </button>
            <span>{replies}</span>
          </div>
        </div>
      </div>
      {/* ---------------- reply section starts here --------------------------*/}
      {showReply && isFullSize && (
        <div className="reply mt-2 relative">
          <div className="relative w-full">
            <textarea
              value={content}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                // e.stopPropagation();
                setContent(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="p-1  whitespace-pre-wra px-2 border border-slate-600 w-full rounded-md text-[13px] pr-16" // extra padding right for icons
              rows={2}
            />
            {/* Send Button */}
            <IoSend
              onClick={handleClick}
              className="absolute right-4 top-[25px] transform -translate-y-1/2 text-slate-700 hover:text-amber-600 text-[20px] cursor-pointer"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-10 top-[25px] transform -translate-y-1/2 text-[20px] text-slate-600"
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-[50px] left-0 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
