import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

interface Subject {
  id: number;
  title: string;
  parentId: number | null;
}

const DraggableTreeNode: React.FC<{
  node: Subject;
  onDrop: (draggedId: number, targetId: number) => void;
  onClick: (event: React.MouseEvent, node: Subject) => void;
}> = ({ node, onDrop, onClick }) => {
  const navigate = useNavigate();
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const clickedRef = useRef(false);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "NODE",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop(() => ({
    accept: "NODE",
    drop: (draggedItem: { id: number }) => {
      onDrop(draggedItem.id, node.id);
    },
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Delay the single-click action to check for a double-click
    if (!clickedRef.current) {
      clickedRef.current = true;
      const timeout = setTimeout(() => {
        onClick(e, node); // Trigger single-click logic
        clickedRef.current = false;
        setClickTimeout(null);
      }, 250); // 250ms delay to detect double-click
      setClickTimeout(timeout);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Cancel single-click action on double-click
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    clickedRef.current = false;

    // Navigate to the desired route
    navigate(`/${node.title}/${node.id}`);
  };

  return (
    <div
      ref={(el) => dragRef(dropRef(el))}
      className={`inline-block p-2 border border-green-500 rounded-lg my-2 bg-white ${
        isDragging ? "bg-gray-200" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        maxWidth: "300px", // Set a maximum width
        wordWrap: "break-word", // Wrap text if it overflows
        cursor: "pointer", // Indicate the node is clickable
      }}
    >
      {node.title}
    </div>
  );
};

export default DraggableTreeNode;
