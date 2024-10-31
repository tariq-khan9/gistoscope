// src/types/react-treebeard.d.ts

declare module "react-treebeard" {
  import { Component, CSSProperties } from "react";

  export interface TreeNode {
    name: string;
    toggled?: boolean;
    children?: TreeNode[];
    active?: boolean;
  }

  export interface TreebeardProps {
    data: TreeNode;
    onToggle?: (node: TreeNode, toggled: boolean) => void;
    decorators?: {
      Header: (props: { node: TreeNode }) => JSX.Element;
    };
  }

  export class Treebeard extends Component<TreebeardProps> {}
}
