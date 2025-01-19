import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

interface NavigationProps {
  currentIndex: number;
  totalItems: number;
  onChangeIndex: (newIndex: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentIndex,
  totalItems,
  onChangeIndex,
  handlePrev,
  handleNext,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempIndex, setTempIndex] = useState<string>(
    (currentIndex + 1).toString()
  ); // Store as a string to handle empty input

  const handleDoubleClick = () => {
    setTempIndex((currentIndex + 1).toString());
    setIsEditing(true);
  };

  const handleIndexChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTempIndex(e.target.value); // Allow any input, including empty
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsedIndex = parseInt(tempIndex, 10);
      if (parsedIndex >= 1 && parsedIndex <= totalItems) {
        onChangeIndex(parsedIndex - 1); // Convert to 0-based index
      } else {
        alert(`Please enter a number between 1 and ${totalItems}`);
      }
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    const parsedIndex = parseInt(tempIndex, 10);
    if (!isNaN(parsedIndex) && parsedIndex >= 1 && parsedIndex <= totalItems) {
      onChangeIndex(parsedIndex - 1);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row text-[10px] sm:text-[14px] font-barlow  justify-center space-x-[6px]">
      {/* Previous Button */}
      <button
        className="arrow hidden sm:block"
        disabled={currentIndex === 0}
        onClick={handlePrev}
      >
        <IoIosArrowDropleft className="arrow" />
      </button>

      {/* Index Display or Editable Input */}
      <div className="flex flex-row font-semibold text-slate-500 justify-center">
        {isEditing ? (
          <input
            type="text"
            value={tempIndex}
            onChange={handleIndexChange}
            onKeyDown={handleKeyPress}
            onBlur={handleBlur}
            autoFocus
            className="w-4 text-center bg-transparent outline-none text-slate-500"
            style={{
              border: "none",
              appearance: "none",
              MozAppearance: "textfield", // Firefox-specific fix
            }}
          />
        ) : (
          <span onDoubleClick={handleDoubleClick} className="cursor-pointer">
            {currentIndex + 1}
          </span>
        )}
        <h1 className="mx-1">/</h1>
        {totalItems}
      </div>

      {/* Next Button */}
      <button
        className="arrow hidden sm:block"
        disabled={currentIndex + 1 === totalItems}
        onClick={handleNext}
      >
        <IoIosArrowDropright className="arrow" />
      </button>
    </div>
  );
};

export default Navigation;
