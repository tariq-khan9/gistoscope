import React, { useState } from "react";
import { HierarchyPointNode } from "d3-hierarchy";
import { TreeNodeDatum } from "react-d3-tree";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<
    React.SetStateAction<HierarchyPointNode<TreeNodeDatum> | undefined>
  >;
  title: string;
  onAdd: (inputValue: string) => void;
}

const AddSubjectModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  onAdd,
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd(inputValue);
    setInputValue(""); // Clear input field after adding
    setIsOpen(undefined); // Close modal after adding
  };

  const handleCancel = () => {
    setInputValue(""); // Clear input field
    setIsOpen(undefined); // Close modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          placeholder="Enter text"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
