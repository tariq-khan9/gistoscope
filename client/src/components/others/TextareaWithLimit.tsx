import React, { ChangeEvent } from "react";

interface TextareaWithLimitProps {
  maxChars: number;
  text?: string;
  setText: (text: string) => void;
}

const TextareaWithLimit: React.FC<TextareaWithLimitProps> = ({
  maxChars,
  text,
  setText,
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        value={text}
        rows={4}
        className="bg-transparent text-[16px] text-slate-800 resize-none w-full h-[90%] outline-none border-none focus:ring-0 focus:outline-none"
        onChange={handleChange}
        placeholder={`Describe your point in ${maxChars} characters...`}
      />
      <div className="flex justify-end text-slate-600">
        {text?.length}/{maxChars} characters
      </div>
    </div>
  );
};

export default TextareaWithLimit;
