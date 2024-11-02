import React, { useState } from "react";
import Tree, { RawNodeDatum, TreeNodeDatum } from "react-d3-tree";
import { HierarchyPointNode } from "d3-hierarchy";
import AddSubjectModal from "./AddSubjectModal";
import "./tree.css";

interface CustomNodeProps {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
}

const initial_tree = [
  {
    name: "Child 1",
    children: [
      {
        name: "Child 1.1",
        children: [
          { name: "Child 1.1.1", children: [] },
          { name: "Child 1.1.2", children: [] },
        ],
      },
      {
        name: "Child 1.2",
        children: [
          { name: "Child 1.2.1", children: [] },
          { name: "Child 1.2.2", children: [] },
        ],
      },
    ],
  },
  {
    name: "Child 2",
    children: [
      {
        name: "Child 2.1",
        children: [
          { name: "Child 2.1.1", children: [] },
          { name: "Child 2.1.2", children: [] },
        ],
      },
      {
        name: "Child 2.2",
        children: [
          {
            name: "Long text example for node 2.2.1 to test spacing",
            children: [],
          },
          {
            name: "Another long text example for node 2.2.2 to test spacing",
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: "Child 3",
    children: [
      {
        name: "Child 3.1",
        children: [
          { name: "Child 3.1.1", children: [] },
          { name: "Child 3.1.2", children: [] },
        ],
      },
      {
        name: "Child 3.2",
        children: [
          { name: "Child 3.2.1", children: [] },
          { name: "Child 3.2.2", children: [] },
        ],
      },
    ],
  },
];

const SubjectTree = () => {
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    name: "Subject",
    children: initial_tree,
  });
  const [node, setNode] = useState<
    undefined | HierarchyPointNode<TreeNodeDatum>
  >(undefined);

  const handleSubmit = (subject: string) => {
    if (node) {
      const new_tree = bfs(node.data.name, tree, subject);
      if (new_tree) {
        setTree(new_tree);
      }
    }
  };

  const handleRightClick = (
    event: React.MouseEvent,
    nodeDatum: TreeNodeDatum
  ) => {
    event.preventDefault(); // Prevent the default right-click menu
    setNode({ data: nodeDatum } as HierarchyPointNode<TreeNodeDatum>);
  };

  interface CustomNodeProps {
    nodeDatum: TreeNodeDatum;
    toggleNode: () => void;
  }

  const renderCustomNode = ({ nodeDatum, toggleNode }: CustomNodeProps) => (
    <g>
      {/* Rectangle Node */}
      <rect
        width={calculateWidth(nodeDatum.name)}
        height={30}
        x={-calculateWidth(nodeDatum.name) / 2} // Center the rectangle
        y={-15}
        fill="white"
        stroke="#457696"
        strokeWidth="1"
        rx="5"
        onClick={toggleNode} // Left-click to toggle children
        onContextMenu={(event) => handleRightClick(event, nodeDatum)} // Right-click to open modal
      />
      <text
        fill="#0a0909" // Text color
        textAnchor="middle"
        alignmentBaseline="central"
        x="0"
        y="0"
        stroke="none"
        style={{
          pointerEvents: "none",
          color: "black",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 400,
          fontSize: 12,
        }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div className="m-12 w-full h-[600px]">
      <Tree
        data={tree}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        pathFunc="diagonal"
        orientation="vertical"
        //  initialDepth={1}
        transitionDuration={300}
        enableLegacyTransitions={true}
        separation={{ siblings: 2, nonSiblings: 2 }}
        renderCustomNodeElement={renderCustomNode}
        translate={{
          x: 700,
          y: 100,
        }}
      />
      {/* Modal to Add New Node */}
      <AddSubjectModal
        isOpen={Boolean(node)}
        setIsOpen={setNode}
        title="Add New Item"
        onAdd={handleSubmit}
      />
    </div>
  );
};

// Function to traverse and add a child node to a specific parent node by name
function bfs(
  name: string,
  tree: RawNodeDatum | RawNodeDatum[],
  new_node_name: string
) {
  const queue: RawNodeDatum[] = [];
  queue.unshift(tree as RawNodeDatum);

  while (queue.length > 0) {
    const current_node = queue.pop();
    if (current_node && current_node.name === name) {
      current_node.children = current_node.children || [];
      current_node.children.push({
        name: new_node_name,
        children: [],
      });
      return { ...tree };
    }

    if (current_node?.children) {
      current_node.children.forEach((child) => queue.unshift(child));
    }
  }
}

const calculateWidth = (text: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = "12px Arial"; // Match the font style you are using in the text
    return Math.max(100, context.measureText(text).width + 10); // Add padding
  }
  return 100; // Default width if canvas context is not available
};

export default SubjectTree;
