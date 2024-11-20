import { useDrag, useDrop } from "react-dnd";

interface Subject {
  id: number;
  title: string;
  parentId: number | null;
}
const DraggableTreeNode: React.FC<{
  node: Subject;
  onDrop: (draggedId: number, targetId: number) => void;
  onClick: (event: React.MouseEvent, node: Subject) => void; // Pass onClick handler from parent
}> = ({ node, onDrop, onClick }) => {
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

  return (
    <div
      ref={(el) => dragRef(dropRef(el))}
      className={`inline-block p-2 border border-green-500 rounded-lg my-2 bg-white ${
        isDragging ? "bg-gray-200" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event propagation to parent tree
        onClick(e, node); // Call the provided onClick handler
      }}
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
