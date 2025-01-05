import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { Tree, TreeNode } from "react-organizational-chart";
import {
  GET_ALL_SUBJECTS,
  UPDATE_SUBJECT,
} from "../../services/graphql/queriesMutations";
import { useQuery, useMutation } from "@apollo/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTreeNode from "./DraggableTreeNode";
import NodeActionModal from "./NodeActionModal";

interface Subject {
  id: number;
  title: string;
  parentId: number | null;
}

const SubjectTree: React.FC = () => {
  const { data, loading } = useQuery(GET_ALL_SUBJECTS);
  const [updateSubjectParent] = useMutation(UPDATE_SUBJECT, {
    refetchQueries: [{ query: GET_ALL_SUBJECTS }],
    awaitRefetchQueries: true,
  });
  const [selectedNode, setSelectedNode] = useState<Subject | null>(null);
  const [modalAction, setModalAction] = useState<string>("none");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  if (loading) return <h1>Loading...</h1>;

  const handleNodeClick = (event: React.MouseEvent, node: Subject): void => {
    event.stopPropagation(); // Prevent event bubbling
    setModalAction("none");
    const modalWidth = 300; // Modal width (same as defined in the modal `width` prop)
    const modalHeight = 200; // Approximate modal height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = event.clientX;
    let y = event.clientY;

    // Adjust position if the modal goes out of bounds
    if (x + modalWidth > viewportWidth) {
      x = viewportWidth - modalWidth - 20; // 10px margin from the edge
    }
    if (y + modalHeight > viewportHeight) {
      y = viewportHeight - modalHeight - 20; // 10px margin from the edge
    }

    setSelectedNode(node);
    setModalPosition({ x, y });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedNode(null);
  };

  const handleDrop = async (draggedId: number, targetId: number) => {
    if (draggedId === targetId) return;
    try {
      await updateSubjectParent({
        variables: { id: draggedId, subject: { parentId: targetId } },
      });
    } catch (err) {
      console.error("Error updating parent ID:", err);
    }
  };

  const renderTreeNodes = (parentId: number | null): JSX.Element[] => {
    return data.subjects
      .filter((node: Subject) => node.parentId === parentId)
      .map((node: Subject) => (
        <TreeNode
          key={node.id}
          label={
            <DraggableTreeNode
              onClick={(e, clickedNode) => handleNodeClick(e, clickedNode)}
              node={node}
              onDrop={handleDrop}
            />
          }
        >
          {renderTreeNodes(node.id)}
        </TreeNode>
      ));
  };

  // all functions for modal i.e add, delete, update subject or create gist for subject

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-20">
        <Tree
          lineWidth={"2px"}
          lineColor={"gray"}
          lineBorderRadius={"10px"}
          label={<div>SUBJECTS</div>}
        >
          {renderTreeNodes(null)}
        </Tree>
      </div>

      {/*----------------------- Modal for Node Actions -------------------------------*/}
      <NodeActionModal
        visible={modalVisible}
        position={modalPosition}
        node={selectedNode || null}
        onClose={handleModalClose}
        setModalAction={setModalAction}
        modalAction={modalAction}
      />
    </DndProvider>
  );
};

export default SubjectTree;
