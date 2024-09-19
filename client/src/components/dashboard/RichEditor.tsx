
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

type RichEditorProps = {
    content: string | undefined;
    setContent: React.Dispatch<React.SetStateAction<string | undefined>>;
  };


export default function RichEditor({content, setContent}: RichEditorProps) {


  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ 'color': [] }, { 'background': [] }], 
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
    <div className="flex bg-white mt-8">
      <div className="w-full min-h-48 h-full">
        <ReactQuill
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