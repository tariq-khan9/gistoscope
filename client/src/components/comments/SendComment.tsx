import React, { useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { IoSend } from "react-icons/io5";
import { CREATE_COMMENT } from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import { compact } from "@apollo/client/utilities";

interface Props {
  editId: number;
  userId: number;
  parentId?: number;
  setShowModal: (value: boolean) => void;
  handleRefetchComments: () => void;
}

const SendComment = ({
  editId,
  userId,
  parentId,
  setShowModal,
  handleRefetchComments,
}: Props) => {
  const [createComment] = useMutation(CREATE_COMMENT);

  const [content, setContent] = useState("");

  const { user } = useGlobalContext();

  const handleClick = async () => {
    if (!user) return;
    if (content === "") return;
    try {
      const res = await createComment({
        variables: {
          newComment: {
            comment: content,
            parentId: parentId || null,
            userId: userId,
            editId: editId,
          },
        },
      });
      console.log(res);
      handleRefetchComments();
      setContent("");
    } catch (error) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!user) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line in the textarea
      handleClick();
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4">
      <div className="relative w-full mt-2 sm:mt-0">
        <textarea
          value={content}
          disabled={!user}
          onKeyDown={handleKeyDown}
          onChange={(e) => setContent(e.target.value)}
          className="p-1 px-2 border border-slate-600 w-full rounded-md text-[13px] pr-10" // Add padding to the right for the icon
          rows={2}
        />
        <IoSend
          onClick={handleClick}
          className="absolute right-4 top-[25px] transform -translate-y-1/2 text-slate-700 hover:text-amber-600 text-[20px] cursor-pointer"
        />
      </div>
      <div className="">
        <button
          disabled={!user}
          onClick={() => setShowModal(true)}
          className="  text-slate-600 h-12 w-full  px-6 text-[13px] rounded-md border border-slate-600 hover:border-amber-600  hover:bg-white hover:text-amber-600"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default SendComment;
