import { BorderHorizontalOutlined, BorderOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type RichEditorProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

export default function RichEditor({
  content,
  setContent,
  editable,
}: RichEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ "code-block": true }],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "video",
    "code-block",
  ];

  return (
    <div className="flex bg-white mt-1 w-full rounded-md">
      <div className="w-full min-h-48 h-full">
        <ReactQuill
          readOnly={editable}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
}
