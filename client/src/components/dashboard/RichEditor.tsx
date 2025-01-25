import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RichEditor.css"; // Import custom CSS file

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
  // Toolbar configuration (only used when `editable` is true)
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
        {editable ? (
          // Render a plain div with the content when `editable` is false
          <div
            className="ql-editor" // Use the same class as ReactQuill's editor for consistent styling
            style={{
              border: "none",
              padding: 0,
              backgroundColor: "transparent",
            }}
            dangerouslySetInnerHTML={{ __html: content }} // Render HTML content
          />
        ) : (
          // Render ReactQuill with toolbar when `editable` is true
          <ReactQuill
            style={{
              border: "none", // Remove border from the container
              padding: 0, // Remove padding if necessary
              backgroundColor: "transparent", // Optional: Ensure the background matches your design
            }}
            readOnly={false} // Editor is editable
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules} // Include toolbar
            formats={formats}
          />
        )}
      </div>
    </div>
  );
}
